export default () =>{
    if(!process.env.PORT){
        console.log('Port not assigned!! in API gateway');
        process.exit(1);
    }

    console.log(`✅ Environment loaded`);
}