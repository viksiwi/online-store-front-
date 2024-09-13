// [
// 	{
// 		"id": "98ed00df-e4db-4cff-a276-5c01c844caba",
// 		"content": "Excellent quality!",
// 		"productId": "28ddc010-9203-4ed3-975b-75458fb066c3",
// 		"userId": "f4bc7abd-4e3f-4b9d-903f-d168f8cd4ecf",
// 		"createdAt": "2024-06-14T07:54:47.461Z",
// 		"updatedAt": "2024-06-14T07:54:47.461Z",
// 		"User": {
// 			"id": "f4bc7abd-4e3f-4b9d-903f-d168f8cd4ecf",
// 			"username": "qwe",
// 			"profilePicture": null
// 		}
// 	},


export interface CommentType {
    id: string;
    content: string;
    productId: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    User: {
        id: string;
        username: string;
        profilePicture: string;
    }
}