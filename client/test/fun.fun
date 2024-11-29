fun getUserName(id) {
    let result <- from users {
        select name, surname
        where user_id = id
    }
    return result;
}
