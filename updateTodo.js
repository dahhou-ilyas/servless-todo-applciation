import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient();

export const handler = async (event) => {
    let todoId;
    let isComplete;

    try {
        const requestBody = JSON.parse(event.body);
        todoId = requestBody.todoId;
        isComplete=requestBody.isComplete

        // Vérifiez si les champs sont définis après l'extraction
        if (!todoId || !isComplete) {
            throw new Error("todoId and isComplete are required");
        }

        await updateTaskStatus(todoId, isComplete);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Task with id ${todoId} updated successfully`,
                isComplete:isComplete
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

const updateTaskStatus = async (todoId, isComplete) => {
    const params = {
        TableName: 'todoTable',
        Key: {
            todoId: { S: todoId.toString() },
        },
        UpdateExpression: 'SET IsComplete = :isComplete',
        ExpressionAttributeValues: {
            ':isComplete': { BOOL: isComplete },
        },
    };
    const command = new UpdateItemCommand(params);
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