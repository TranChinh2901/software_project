// import { VoucherType } from "@/modules/orders/enum/order.enum";
// import Joi from "joi";

// export const VoucherSchema = Joi.object({
//     code: Joi.string().alphanum().min(3).max(20).required().messages({
//         "string.empty": "Voucher code is required",
//         "string.alphanum": "Voucher code must be alphanumeric",
//         "string.min": "Voucher code must be at least 3 characters long",
//         "string.max": "Voucher code must be at most 20 characters long",
//         "any.required": "Voucher code is required",
//     }),
//     discount_voucher: Joi.number().min(1).max(100).required().messages({
//         "number.base": "Discount must be a number",
//         "number.min": "Discount must be at least 1%",
//         "number.max": "Discount cannot exceed 100%",
//         "any.required": "Discount is required",
//     }),
 
//      status: Joi.string()
//         .valid(...Object.values(VoucherType))
//         .required()
//         .messages({
//           "any.only": `Status must be one of: ${Object.values(VoucherType).join(
//             ", "
//           )}`,
//         }),
// })



