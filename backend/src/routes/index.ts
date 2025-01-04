import express from "express";
import { checkRequiredHeaders } from "../middleware/check-headers";
import { pawnterSignup } from "../controllers/sign-up";
import { pawnterLogin } from "../controllers/login";
import { getUserPawnterProfile } from "../controllers/get-user-pawnter-profile";
import { isPawnterLoggedIn } from "../middleware/logged-in";

const router = express.Router();

router.route("/pawnter-signup").post(checkRequiredHeaders, pawnterSignup);
router.route("/pawnter-login").post(checkRequiredHeaders, pawnterLogin);
router
    .route("/pawnter-profile")
    .get(checkRequiredHeaders, isPawnterLoggedIn, getUserPawnterProfile);

export { router };
