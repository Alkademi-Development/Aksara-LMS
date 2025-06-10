import responseError from "@src/core/domains/http/handlers/responseError";
import PostgresAdapter from "@src/core/domains/postgres/adapters/PostgresAdapter";
import { App } from "@src/core/services/App";
import { Request, Response } from "express";
import { Sequelize } from "sequelize";

/**
 * Health check endpoint
 * 
 * This endpoint is used to check if the database connection is active
 * 
 * @param {Request} req
 * @param {Response} res
 */
export default async (req: Request, res: Response) => {

    try {
        const db = App.container('db');
        const adapter = db.getAdapter();

        // Check if the provider is Postgres
        if (adapter as unknown instanceof PostgresAdapter) {
            const pool = (adapter as PostgresAdapter).getSequelize();
            await (pool as Sequelize).query('SELECT 1 as connected');
        }
    }
    catch (error) {
        // If there is an error, send the error response
        responseError(req, res, error as Error)
        return;
    }

    // If the database connection is active, send a success response
    res.send('OK')
}
