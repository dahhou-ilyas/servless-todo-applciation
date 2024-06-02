import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient();

export const handler = async (event) => {
    let todoId;

    try {
        console.log(event, " xxxxxxxxxxxxxxxx ");

        // Parse the event body to extract the todoId
        if (event.body) {
            const requestBody = JSON.parse(event.body);
            todoId = requestBody.todoId;
        } else {
            todoId = event.todoId;
        }

        // Vérifiez si todoId est défini après l'extraction
        if (!todoId) {
            throw new Error("todoId is required");
        }

        await deleteTaskById(todoId);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Task with id ${todoId} deleted successfully`,
            }),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (err) {
        console.error(err);
        return errorResponse(err.message, event.requestContext.requestId);
    }
};

const deleteTaskById = async (todoId) => {
    const params = {
        TableName: 'todoTable',
        Key: {
            todoId: { S: todoId.toString() },
        },
    };
    const command = new DeleteItemCommand(params);
    await ddbClient.send(command);
};

const errorResponse = (errorMessage, awsRequestId) => {
    return {
        statusCode: 500,
        body: JSON.stringify({
            Error: errorMessage,
            Reference: awsRequestId,
        }),
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    };
};