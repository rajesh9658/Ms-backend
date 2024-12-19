import { Router ,Request, Response} from 'express';
import { Tagmodel } from '../db/dbschema';



const tagrouter = Router();
tagrouter.get('/test', async (req, res) => {
    res.json({ message: 'test route working fine' });
})

tagrouter.post('/createtag', async (req: Request, res: Response) => {
    try{
        const {title} = req.body;

        await Tagmodel.create({title});
        res.status(200).json({ message: 'Tag created successfully'});
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: 'Tag creation failed',
            error: error
        });
    }
});


tagrouter.get('/gettags', async (req: Request, res: Response) => {
    try{
        const tags = await Tagmodel.find({},'_id title');
        res.status(200).json(tags);
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: 'Tag fetching failed',
            error: error
        });
    }
});

export default tagrouter;
