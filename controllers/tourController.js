const Tour = require('./../models/tourmodel');




exports.getAllTour = async (req,res)=>{
    try{
        let query =  Tour.find();

        if(req.query.sort){
            const sortedby = req.query.sort.split(',').join(' ');
            query = query.sort(sortedby);
        }

        // filtering
         let queryStr = JSON.stringify(req.query);
         queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g,match=>`$${match}`);
         query = Tour.find(JSON.parse(queryStr));

        //limiting fields
        if(req.query.fields){
            const fields = req.query.fields.split(',').join(' ');
            query = query.select(fields);
        }
        else{
            query = query.select('-__v');
        }


        // pagination 
        const page = req.query.page *1 || 1 ;
        const limit = req.query.limit *1 || 100;
        const skip = (page-1)*limit;

        query = query.skip(skip).limit(limit);


         const tours = await query;

        res.status(200).json({
            status:'success',
            data:{
                tours
            }
        });

    }catch(err){
        res.status(400).json({
            status:'fail',
            message: 'Input is not correct'
        });
    }
}



exports.createTour = async (req,res)=>{
    console.log(Tour);
    try{
        const newTour = await Tour.create(req.body);
    
        res.status(201).json({
            status: 'Success',
            data:{
                  newTour
            }
        });

    }catch(err){
        res.status(400).json({
            status:'fail',
            message: 'Input is not correct'
        });
    }

}


exports.updateTour = async (req,res)=>{
    try{
        const tour = await Tour.findbyIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true});
        
        if(!tour){
            return `Tour does not exists with This id ${req.params.id} `;
        }
    
        res.status(200).json({
            status: 'success',
            data:{
                tour
            }
        });
    }catch(err){
        res.status(400).json({
            status:'fail',
            message: 'tour is not updated successfuly'
        })

    }
}

exports.deleteTour = async (req,res)=>{

    try{
        await Tour.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: 'success'
        });
    }catch(err){
        res.status(400).json({
            status: 'fail',
            message: 'Tour id is not found'
        });
    }

}