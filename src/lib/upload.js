import {getDownloadURL,ref,uploadBytesResumable} from "firebase/storage"
import {storage} from "./Firebase"
const upload=async(file)=>{
    const date=new Date()
    const storageRef = ref(storage,`images/${date+file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);
    
   return new Promise((resolve,reject)=>{
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        

      }, 
      (error) => {
        reject("something went wrong"+error.code)
      }, 
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        //   console.log('File available at', downloadURL);
        resolve(downloadURL)
        });
      }
    );
   });
}
export default upload