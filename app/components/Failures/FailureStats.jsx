"use client";


import {
  Box,
  Card,
  Group,
  Text,
  Stack
} from "@mantine/core";


import DistrictCard from "./DistrictCard";


import {
  statusConfig,
  summaryOnlyStatuses
} from "./statusConfig";





export default function FailureStats({
  items=[]
}){



const stats={};




// ================================
// تجميع البيانات
// ================================

items.forEach(item=>{


const district =
item.districtName || "غير معروف";


const block =
item.blockName || "غير معروف";


const status =
item.status || "Unknown";



let lastUser=null;



if(
  !summaryOnlyStatuses.includes(status)
  &&
  item.activities?.length
){

  lastUser =
    item.activities.at(-1)?.userName ||
    "Unknown";

}





if(!stats[district]){

  stats[district]={
    total:0,
    blocks:{}
  };

}




stats[district].total++;






if(!stats[district].blocks[block]){

  stats[district].blocks[block]={

    total:0,

    statuses:{}

  };

}





const blockData =
stats[district].blocks[block];





blockData.total++;





if(!blockData.statuses[status]){

  blockData.statuses[status]={

    total:0,

    users:{}

  };

}




blockData.statuses[status].total++;






// ================================
// المستخدمين
// ================================

if(lastUser){



const users =
blockData.statuses[status].users;



if(!users[lastUser]){

  users[lastUser]={

    count:0,

    ids:[]

  };

}



users[lastUser].count++;





if(
 !users[lastUser].ids.includes(item.id)
){

 users[lastUser].ids.push(
   item.id
 );

}



}



});







// ================================
// تجميع الحالات العامة
// ================================


const totalStatuses={};



Object.keys(statusConfig)
.forEach(status=>{

  totalStatuses[status]=0;

});




items.forEach(item=>{


const status =
item.status || "Unknown";



if(
 totalStatuses[status] !== undefined
){

 totalStatuses[status]++;

}
else{

 totalStatuses[status]=1;

}


});








return (


<Box

p="md"

style={{

background:"#f8fafc",

minHeight:"100vh"

}}

>


<Stack gap="md">





{/* ===========================
      الإحصائيات العامة
=========================== */}



<Card

radius="xl"

p="lg"

style={{

background:
"linear-gradient(135deg,#ff6b6b,#ff8787)"

}}

>



<Stack

align="center"

gap="md"

>



<Text

size="md"

fw={900}

c="white"

>

إحصائيات المخالفات لجميع المناطق

</Text>






<Group

justify="center"

gap="md"

wrap="wrap"

>





{/* الكلي */}



<Card

radius="xl"

p="md"

style={{

minWidth:130,

textAlign:"center",

background:
"rgba(255,255,255,.25)",

border:
"1px solid rgba(255,255,255,.3)"

}}

>


<Text

size="xs"

fw={700}

c="white"

>

الكلي

</Text>



<Text

size="32px"

fw={900}

c="white"

>

{items.length}

</Text>



</Card>







{/* الحالات */}



{

Object.entries(totalStatuses)

.map(([status,count])=>(



<Card

key={status}

radius="xl"

p="md"

style={{

minWidth:130,

textAlign:"center",

background:
"rgba(255,255,255,.18)",

border:
"1px solid rgba(255,255,255,.3)"

}}

>




<Text

size="xs"

fw={700}

c="white"

>

{
statusConfig[status]?.label || status
}

</Text>




<Text

size="32px"

fw={900}

c="white"

>

{count}

</Text>




</Card>



))

}




</Group>



</Stack>



</Card>








{/* ===========================
      المناطق
=========================== */}



{

Object.entries(stats)

.map(([district,data])=>(


<DistrictCard

key={district}

district={district}

data={data}

/>


))


}





</Stack>


</Box>


);


}