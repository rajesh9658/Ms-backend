import { Router ,Request, Response} from 'express';
import { Contentmodel } from '../db/dbschema';
import mongoose from 'mongoose';


const contentrouter = Router();
contentrouter.get('/test', async (req, res) => {
    res.json({ message: 'test route working fine' });
})

//create content
contentrouter.post('/createcontent', async (req: Request, res: Response) => {
    try{
        const {link, type, title, description, tags, userid} = req.body;

        await Contentmodel.create({
            link,
             type,
              title,
               description,
                tags,
                date: Date.now(),
                userid
            });
        res.status(200).json({ message: 'Content created successfully'});
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: 'Content creation failed',
            error: error
        });
    }
});


//delete content
contentrouter.delete('/remove', async (req: Request, res: Response): Promise<void> => {
    try {
      const { contentId, userId } = req.body;
  
      if (!contentId || !userId) {
        res.status(400).json({ msg: 'Content ID and User ID are required' });
        return;
      }
  
      // Check if contentId is a valid ObjectId
      if (!mongoose.Types.ObjectId.isValid(contentId)) {
          res.status(400).json({ message: 'Invalid Content ID' });
          return;
        }
  
      const content = await Contentmodel.findById(contentId)
  
      if (!content) {
        res.status(404).json({ msg: 'Content not found' });
        return;
      }
  
      // Check if the user making the request is the owner of the content
      if (content.userid && content.userid.toString() !== userId) {
        res.status(403).json({ msg: 'You are not authorized to delete this content' });
        return ;
      }
  
     
      await Contentmodel.findByIdAndDelete(contentId)
  
  
      res.status(200).json({ msg: 'Content deleted successfully' });
      return ;
    } catch (error) {
      console.error('Error deleting content:', error)
      res.status(500).json({ msg: 'Internal Server Error' });
      return ;
    }
  })

export default contentrouter;