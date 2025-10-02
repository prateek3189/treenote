"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const image_upload_1 = require("../utils/image-upload");
const contact_controller_1 = require("../controllers/contact-controller");
const router = express.Router();
// Contacts Page
router.get("/", contact_controller_1.contactHome);
// Add Contacts page
router.get("/add", contact_controller_1.addContactHome);
// Add Contact page
router.post("/add", image_upload_1.upload.single("avatar"), contact_controller_1.addContactController);
// Edit Contact page
router.get("/edit/:id", contact_controller_1.editContactPage);
// Update Contact page
router.post("/update", image_upload_1.upload.single("avatar"), contact_controller_1.updateContactController);
// Delete Contact page
router.post("/delete", contact_controller_1.deleteContactController);
exports.default = router;
//# sourceMappingURL=contact.route.js.map