/**
 * @swagger
 * paths:
 *  /:
 *   get:
 *    summary: Authenticate token cookie
 *    operationID: Authenticate Token
 *    tags:
 *     - User
 *    responses:
 *      200:
 *        description: Declare that user is autheticated
 *
 *
 *  /logout:
 *   get:
 *    summary: Logout and delete token cookie
 *    operationID: Logout
 *    tags:
 *     - User
 *    responses:
 *      200:
 *        content:
 *         application/json:
 *          schema:
 *           type: object
 *           properties:
 *            status:
 *             type: string
 *            message:
 *             type: string
 *  
 */

import { Router, Request, Response } from "express";
import logout from "@controllers/AuthenRegist/logout.controller";
import * as userController from "@controllers/user.controller";
import { r } from "@faker-js/faker/dist/airline-C5Qwd7_q";
//import userController from "@controllers/user-controller";

const router: Router = Router();

router.route("/").get((req: Request, res: Response) => {
    res.sendStatus(200);
});
router.get("/logout", logout);
router.put("/user", userController.updateUser);
router.get("/user", userController.getUserInfo);
router.post("/story", userController.setStory);
router.delete("/story", userController.deleteStory);
export default router;
