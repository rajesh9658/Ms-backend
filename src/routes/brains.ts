import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { Contentmodel, Linkmodel } from '../db/dbschema';
import userMiddleware from '../middleware/middleware';

const brainrouter = Router();

brainrouter.get('/test', async (req, res) => {
    res.json({ message: 'test route working fine' });
});

interface User {
    _id: string;
    email: string;
    username: string;
}

interface CustomRequest extends Request {
    user?: User;
}

brainrouter.post('/share', userMiddleware, async (req: CustomRequest, res: Response): Promise<void> => {
    console.log("/share route hit");
    try {
        const { share } = req.body;
        const userId = req.user?._id;

        console.log(userId);

        if (!userId) {
            res.status(400).json({ error: 'User ID is required' });
            return;
        }

        // Check if the user has an existing shareable link
        const existingLink = await Linkmodel.findOne({ userId });

        if (share) {
            // If sharing is enabled
            if (existingLink) {
                // Reuse existing link
                const hashval = existingLink.hash;
                res.status(200).json({ hashval });
                return;
            }

            // Create a new link
            const hash = crypto.randomBytes(16).toString('hex');
            const newLink = await Linkmodel.create({ userId, hash });
            const hashvalue = newLink.hash;
            res.status(201).json({ hashvalue });
            return;
        } else {
            // If sharing is disabled
            if (existingLink) {
                // Delete the existing link
                await Linkmodel.deleteOne({ userId });
                res.status(200).json({ message: 'Sharing disabled, link removed.' });
                return;
            }

            // No link to remove
            res.status(404).json({ error: 'No shareable link found for this user.' });
            return;
        }
    } catch (error) {
        console.error('Error toggling shareable link:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
        return;
    }
});

brainrouter.get('/share/user/:userId', async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const userId = req.params.userId;

        // Find the link associated with the userId
        const link = await Linkmodel.findOne({ userId });

        if (!link) {
            res.status(404).json({ msg: 'No shareable link found' });
            return;
        }

        res.status(200).json({ link });
    } catch (error) {
        console.error("Error retrieving user's shareable link:", error);
        res.status(500).json({ error: 'An error occurred while retrieving the user shareable link.' });
    }
});

brainrouter.get('/share/:hash', async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const hash = req.params.hash;

        // Find the link associated with the hash
        const link = await Linkmodel.findOne({ hash }).populate({
            path: 'userId', // Field to populate
            select: 'username',
        });

        if (!link) {
            res.status(404).json({ error: 'Invalid or expired link' });
            return;
        }

        // Retrieve all shared contents for the associated user
        const sharedContents = await Contentmodel.find({
            userId: link.userId
        });

        const user = link.userId;
        res.status(200).json({ user, sharedContents });
    } catch (error) {
        console.error('Error retrieving shared contents:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the shared contents.' });
    }
});

export default brainrouter;
