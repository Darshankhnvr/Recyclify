import prisma from "../db";

export async function getPublishedGuides({category, page =1, limit =10} ={}){
try {
    const whereClause = {
        published : true,
    }
    if(category){
        whereClause.category = category;
    }

    const skip = (page -1) * limit;

    const guides = await prisma.recyclingGuide.findMany({
        where : whereClause,
        orderBy :{
            publishedAt : 'desc',
        },
        skip : skip,
        take : limit,
    })

    const totalGuides = await prisma.recyclingGuide.count({where: whereClause})

    return guides
} catch (error) {
    console.error("Error fetching published guides:", error);
    return [];
}
}

export async function getGuideBySlug(slug){
    if(!slug){
        return null;
    }

    try {
        const guide = await prisma.recyclingGuide.findUnique({
            where: {
                slug: slug,
                published: true
            }
        })
        return guide;
    } catch (error) {
        console.error(`Error fetching guide by slug (${slug}):`, error);
    return null;
    }
}

export async function getGuideCategories(){
    try {
        const categories = await prisma.recyclingGuide.findMany({
            where:{
                published : true,
            },
            select:{
                category: true,
            },
            distinct : ['category'],
            orderBy:{
                category : 'asc'
            }
        })

        return categories.map( c => c.category)
    } catch (error) {
        console.error("Error fetching guide categories:", error);
    return [];
    }
}
