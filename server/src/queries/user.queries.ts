const userQueries = {
    ADD_NEW_USER: `INSERT INTO
    users
    (first_name ,last_name, username, email, password)
    VALUES
    (?,?,?,?,?)
    `,
    CHECK_IF_EMAIL_EXIST: `SELECT * FROM \`users\` WHERE email = ?`,

    LOGIN_EMAIL: `SELECT * from users where email = ?`,

    LOGIN_USERNAME: `SELECT * from users where username = ?`,

    CHECK_IF_USERNAME_EXIST: `SELECT * FROM \`users\` WHERE username = ?`,

    UPDATE_EMAIL_VERIFIED: 'UPDATE `users` SET email_verified = ? WHERE user_id = ?',

}

export default userQueries;