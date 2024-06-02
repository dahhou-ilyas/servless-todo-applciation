import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient();

export const handler = async (event) => {
    let todoId;

    try {
        // Vérifiez si l'événement a un body et parsez-le
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

        const task = await getTaskById(todoId);

        if (!task) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    message: `Task with id ${todoId} not found`,
                }),
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                Title:task.Title.S,
                todoId:task.todoId.S,
                IsComplete:task.IsComplete.BOOL,
                CreatedAt:task.CreatedAt.S}),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (err) {
        console.error(err);
        return errorResponse(err.message);
    }
};

const getTaskById = async (todoId) => {
    const params = {
        TableName: 'todoTable',
        Key: {
            todoId: { S: todoId.toString() },
        },
    };
    const command = new GetItemCommand(params);
    const data = await ddbClient.send(command);
    return data.Item;
};

const errorResponse = (errorMessage) => {
    return {
        statusCode: 500,
        body: JSON.stringify({
            Error: errorMessage,
        }),
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    };
};