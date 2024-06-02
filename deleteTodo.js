import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";

const ddbClient = new DynamoDBClient();

export const handler = async () => {
    try {
        const tasks = await getAllTasks();
        const result = tasks.map(item => ({
          Title: item.Title.S,
          todoId: item.todoId.S,
          IsComplete: item.IsComplete.BOOL,
          CreatedAt: item.CreatedAt.S
        }));

        return {
            statusCode: 200,
            body: JSON.stringify(result),
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (err) {
        console.error(err);
        return errorResponse(err.message);
    }
};

const getAllTasks = async () => {
    const params = {
        TableName: 'todoTable',
    };
    const command = new ScanCommand(params);
    const data = await ddbClient.send(command);
    return data.Items;
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