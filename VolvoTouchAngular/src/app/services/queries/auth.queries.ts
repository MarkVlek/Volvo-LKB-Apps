export function signInGraphQLQuery() {
    return {
        "id":"<id>"
        ,"password":"<pwd>"
    }
}

export function generateTokenGraphQLQuery(keyId: any) {
    return {
        "key_id": keyId,
        "ttl":3600
    }
}