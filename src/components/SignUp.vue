<script setup>
import {ref,defineEmits} from 'vue'
import {createUserWithEmailAndPassword} from 'firebase/auth';
import {setDoc,doc} from "firebase/firestore"
import {db, auth} from './firebase.js';
import {useToast} from 'vue-toastification'
  const toast = useToast()
  const emit = defineEmits(["changeView"])
  const email = ref("")
  const password = ref("")
  const userName = ref("")
  const changeTheView = ()=>{
  emit('changeView','login')
  }
  
  //create a user
  const signUp = async () => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value);
    const user = userCredential.user
    
    await setDoc(doc(db,"users",user.uid),{
    uid:user.uid,
    email:user.email,
    name :userName.value,
    favorites:[],
    addedVideos:[]
    })
    toast.success("user created")
  } catch (error) {
    toast.error(error)
  }
};
  
</script>
<template>
  <div class="signInPage">
      <p>Sign up</p>
    <input v-model="userName" type="text" placeholder="Enter your name"/>
    <input v-model="email" type="email" placeholder="Enter your email"/>
    <input v-model="password" type="password" placeholder="Enter your password"/>
    <button @click="signUp">Sign up</button>
    <button @click="changeTheView" class="backBtn">Login</button>
     </div>
</template>

<style scoped>
  div {
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  text-align:center;
  box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;
  padding:10px;
  background:#fffffa;
  color:#313638
  }
  div p{
  letter-spacing:3px;
  font-size:1.5rem;
  color:#dc5454;
  }
  input{
  margin:10px 20px;
  height:40px;
  background:transparent;
  border:0;
  border-bottom:1px solid black;
  }
  input:focus{
  outline:none;
  }
  button{
  width:50%;
  height:40px;
  margin:10px 0px;
  background:#dc5454;
  border:0;
  color:#fefefe;
  }
  button:active{
  background:#e9adadc6;
  color:black
  }
  .backBtn{
  background:#f5c266;
  display:block;
  margin:0 auto
  }
</style>