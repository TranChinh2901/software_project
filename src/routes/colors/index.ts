import express from 'express';
import { validateBody } from '@/middlewares/validate.middleware';
import { CreateColorSchema } from '@/modules/colors/schema/color.schema';
import colorController from '@/modules/colors/color.controller';
import { requireAuth } from '@/middlewares/auth.middleware';
const router = express.Router();

router.post('/', 
    validateBody(CreateColorSchema), 
    colorController.createColor
);
router.get('/', colorController.getAllColors);
router.get('/:id', colorController.getColorById);
router.put('/:id', 
    requireAuth(),
    // validateBody(UpdateColorSchema), 
    colorController.updateColor
);
router.delete('/:id', requireAuth(), colorController.deleteColor);

export default router;
