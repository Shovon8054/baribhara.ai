import pool from "../db/dbConnection.js";

class ChatService {

    // =====================================
    // GET CHAT LIST
    // =====================================

    async getChatList(userId: string) {

        const result = await pool.query(
            `
            SELECT
                other_user.id AS user_id,
                other_user.full_name,
                other_user.profile_image,

                latest_message.content AS last_message,
                latest_message.created_at AS last_message_time,

                (
                    SELECT COUNT(*)
                    FROM messages unread
                    WHERE unread.receiver_id = $1
                    AND unread.sender_id = other_user.id
                    AND unread.is_read = FALSE
                ) AS unread_count

            FROM users other_user

            JOIN LATERAL (
                SELECT
                    m.content,
                    m.created_at
                FROM messages m
                WHERE
                    (
                        m.sender_id = $1
                        AND m.receiver_id = other_user.id
                    )
                    OR
                    (
                        m.sender_id = other_user.id
                        AND m.receiver_id = $1
                    )
                ORDER BY m.created_at DESC
                LIMIT 1
            ) latest_message ON TRUE

            WHERE other_user.id != $1

            ORDER BY latest_message.created_at DESC
            `,
            [userId]
        );

        return result.rows;
    }


    // =====================================
    // GET MESSAGES
    // =====================================

    async getMessages(
        userId: string,
        otherUserId: string
    ) {

        const result = await pool.query(
            `
            SELECT
                id,
                content,
                sender_id,
                receiver_id,
                is_read,
                read_at,
                created_at
            FROM messages
            WHERE
                (
                    sender_id = $1
                    AND receiver_id = $2
                )
                OR
                (
                    sender_id = $2
                    AND receiver_id = $1
                )
            ORDER BY created_at ASC
            `,
            [userId, otherUserId]
        );

        return result.rows;
    }


    // =====================================
    // SEND MESSAGE
    // =====================================

    async sendMessage(
        senderId: string,
        receiverId: string,
        content: string
    ) {

        const result = await pool.query(
            `
            INSERT INTO messages (
                content,
                sender_id,
                receiver_id
            )
            VALUES ($1, $2, $3)

            RETURNING
                id,
                content,
                sender_id,
                receiver_id,
                is_read,
                read_at,
                created_at
            `,
            [
                content,
                senderId,
                receiverId
            ]
        );

        return result.rows[0];
    }


    // =====================================
    // MARK AS READ
    // =====================================

    async markMessagesAsRead(
        userId: string,
        senderId: string
    ) {

        const result = await pool.query(
            `
            UPDATE messages
            SET
                is_read = TRUE,
                read_at = CURRENT_TIMESTAMP
            WHERE
                sender_id = $1
                AND receiver_id = $2
                AND is_read = FALSE

            RETURNING *
            `,
            [
                senderId,
                userId
            ]
        );

        return result.rows;
    }
    async getChatUser(userId: string) {
        const result = await pool.query(
            `
        SELECT
            id,
            full_name,
            profile_image,
            role
        FROM users
        WHERE id = $1
        `,
            [userId]
        );

        if (result.rows.length === 0) {
            throw new Error("User not found");
        }

        return result.rows[0];
    }
}

export default new ChatService();