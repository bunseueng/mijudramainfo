
// Recursive function to find a comment by ID in a nested comments structure
export async function findCommentById(commentId: string, comments: any[]): Promise<any> {
    for (const comment of comments) {
        if (comment.id === commentId) {
            return comment;
        } else if (comment.replies?.length > 0) {
            const foundComment = await findCommentById(commentId, comment.replies);
            if (foundComment) {
                return foundComment;
            }
        }
    }
    return null;
}