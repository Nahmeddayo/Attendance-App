import React,{useEffect,useState} from "react"
import {View,Text,TextInput,Image,StyleSheet,TouchableOpacity,ScrollView} from "react-native"
import { Header,ImagePickers } from "../../components"
import firebase from "firebase";
// import { getAuth } from "firebase/auth";
// import {getDatabase} from "firebase/database"
import{marginTop, vh, vw,headerfont,globaltextcolor,headerbackground}from"../../constants"
// import { getUserDetails,logOut } from "../../services/Firebase";

const Profile =()=>{
    useEffect(()=>{
        getUserDetails()

    },[]);

    const [inputs,setInputs]=useState({
        email:"",
        name:"",
        image:""
    })

    const onChangeHandler = (type, value) => {
        setInputs({
            ...inputs,
            [type]: value
        })
    }


    const logout=()=>{
        firebase.auth().signOut()
    }
    const[userDetails,setuserDetails]=useState({})

    const getUserDetails=()=>{
        let id=firebase.auth().currentUser.uid
        firebase.database().ref(`users/${id}`)
        .on("value",snapshotttt =>{
        //  console.log(id,"IDDDDD");
            // console.log(snapshotttt.val(),"Valuee");
            setuserDetails(snapshotttt.val())
        })
    }
    const updateProfile = () => {
        // alert("update")
        firebase.database().ref(`users/${firebase.auth().currentUser.uid}`).update({
            ...inputs
        })


    }
    const getImage=(images)=>{
        console.log(images,"sourece variable");
        uploadImageToCloudinary(images)
     }
 
     const uploadImageToCloudinary=async (e) =>{
         console.log(e, "EEEEEE");
         let apiUrl = 'https://api.cloudinary.com/v1_1/ddg5474bs/image/upload';
 
         let data = {
             "file": e,
             "upload_preset": "attendance-app",
         }
 
         fetch(apiUrl, {
             body: JSON.stringify(data),
             headers: {
                 'content-type': 'application/json'
             },
             method: 'POST',
         }).then(async r => {
             let data = await r.json()
             console.log(data.secure_url)
             setInputs({...inputs,image:data.secure_url})
         }).catch(err => console.log(err))
     }

    return(
        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.mainView}>
            <Header heading="Profile"/>
            <View style={{justifyContent:"center",alignItems:"center"}}>
            <View style={{backgroundColor:headerbackground,width:vw*0.9,height:"60%",justifyContent:"center",alignItems:"flex-start",borderRadius:20,elevation:10}}>
            <Image source={{uri:userDetails.image}} style={styles.image}/>
            <View style={styles.cardview}>
                <Text style={styles.text}>
                Email: {userDetails.name}
            </Text>
            </View>
            
            <View style={styles.cardview}>
                <Text style={styles.text}>
                Email: {userDetails.email}
            </Text>
            </View>
            </View>
            </View>
            <TouchableOpacity style={styles.updatebtn} onPress={logout}>
                <Text style={styles.text}>
                LOGOUT
            </Text>
            </TouchableOpacity>
        </ScrollView>
    )
}
const styles=StyleSheet.create({
    mainView:{
        flex:1,
    },
    image:{
        height:100,
        width:100,
        borderRadius:50,
        marginTop:vh*0.01,
        marginHorizontal:vw*0.04,
    },
    cardview:{
        marginVertical:vh*0.01,
        marginHorizontal:vw*0.02,
        padding:10,
        color:globaltextcolor,
        fontSize:headerfont,
        fontWeight:"bold",
        textAlign:"center"
    },
    logoutbtn:{
        borderWidth:1,
        marginHorizontal:vw*0.07,
        borderRadius:10,
        padding:10,
        elevation:20,
        backgroundColor:"black"
    },
    updatebtn:{
        borderWidth:1,
        marginHorizontal:vw*0.07,
        borderRadius:10,
        padding:10,
        elevation:20,
        backgroundColor:"black",
        marginTop:vh*0.02
    },
    text:{
        color:globaltextcolor,
        fontSize:headerfont,
        fontWeight:"bold",
        textAlign:"center"
    }
})

export default Profile