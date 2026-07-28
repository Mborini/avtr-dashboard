"use client";

import { useState } from "react";

import {
  Card,
  Text,
  Group,
  Badge,
  Stack,
  Divider,
  SimpleGrid,
  Avatar,
  Modal,
} from "@mantine/core";


import {
  IconBuildings,
  IconMapPin,
  IconUser,
} from "@tabler/icons-react";


import {
  statusConfig,
  summaryOnlyStatuses
} from "./statusConfig";




export default function DistrictCard({
  district,
  data
}) {


  const [opened,setOpened] = useState(false);

  const [selectedUser,setSelectedUser] = useState(null);



  // ==================================
  // تجميع الحالات لكل منطقة
  // ==================================

  const districtStatuses = {};


  Object.keys(statusConfig).forEach((status)=>{

    districtStatuses[status] = 0;

  });



  Object.values(data.blocks || {})
  .forEach((block)=>{


    Object.entries(block.statuses || {})
    .forEach(([status,statusData])=>{


      if(districtStatuses[status] === undefined){

        districtStatuses[status] = 0;

      }


      districtStatuses[status] += statusData.total;


    });


  });






return (

<Card

radius="xl"

p="md"

shadow="xs"

style={{

background:"#fff",

border:"1px solid #edf2f7",

}}

>



{/* ================= HEADER ================= */}


<Group

justify="space-between"

align="center"

mb="xs"

>



<Group gap="sm">


<Badge

size="xl"

radius="xl"

variant="light"

color="blue"

p={8}

>

<IconBuildings size={20}/>

</Badge>



<Text

fw={900}

size="lg"

>
منطقة 
{" "}
{district}

</Text>



</Group>




<Group gap="xs">


<Text

size="sm"

c="dimmed"

fw={700}

>

إجمالي المخالفات

</Text>



<Badge

size="lg"

radius="xl"

variant="filled"

color="blue"

>

{data.total}

</Badge>



</Group>



</Group>







{/* ================= STATUS SUMMARY ================= */}



<Card

mt="md"

radius="xl"

p="md"

style={{

background:"#f8fafc",

border:"1px solid #edf2f7",

}}

>


<Group

justify="center"

mb="sm"

>

<Text

fw={800}

size="md"

>

ملخص حالات المخالفات لمنطقة {district}

</Text>


</Group>





<Group

justify="center"

gap="sm"

wrap="wrap"

>



{

Object.entries(districtStatuses)

.map(([status,count])=>(


<Card

key={status}

radius="lg"

p="xs"

style={{

minWidth:110,

textAlign:"center",

background:

statusConfig[status]?.bg || "#fff",

border:"1px solid rgba(0,0,0,.05)"

}}

>


<Text

size="xs"

fw={600}

c="dimmed"

mb={4}

>

{

statusConfig[status]?.label || status

}

</Text>



<Text

fw={900}

size="xl"

>

{count}

</Text>



</Card>


))

}



</Group>


</Card>







<Divider my="md"/>







{/* ================= BLOCKS ================= */}



<SimpleGrid

cols={{

base:1,

sm:4,

md:4

}}

spacing="sm"

>



{

Object.entries(data.blocks || {})

.map(([block,blockData])=>(



<Card

key={block}

radius="lg"

p="sm"

shadow="xs"

style={{

background:"#fafafa",

border:"1px solid #f1f3f5"

}}

>



<Group

justify="space-between"

mb="xs"

>



<Group gap="xs">


<Badge

size="lg"

radius="xl"

variant="light"

color="blue"

p={8}

>

<IconMapPin size={18}/>

</Badge>



<Text

fw={800}

size="sm"

>
حي 
{" "}
{block}

</Text>


</Group>




<Badge

size="lg"

radius="xl"

variant="filled"

color="blue"

>

{blockData.total}

</Badge>



</Group>







<Stack gap="xs">


{

Object.entries(blockData.statuses || {})

.map(([status,statusData])=>(



<Card

key={status}

radius="md"

p="xs"

style={{

background:

statusConfig[status]?.bg || "#fff",

border:"none"

}}

>




<Group

justify="space-between"

>

<Group gap={6}>


{statusConfig[status]?.icon}



<Text

fw={600}

size="sm"

>

{

statusConfig[status]?.label || status

}

</Text>


</Group>



<Badge

size="sm"

color={

statusConfig[status]?.color || "gray"

}

variant="light"

>

{statusData.total}

</Badge>



</Group>







{

!summaryOnlyStatuses.includes(status)

&&


<Stack

mt="xs"

gap={6}

>


{

Object.entries(statusData.users || {})

.map(([user,count])=>(



<Group

key={user}

justify="space-between"

p={6}

style={{

background:"rgba(255,255,255,.7)",

borderRadius:8

}}

>



<Group gap="xs">


<Avatar

size="sm"

radius="xl"

color="blue"

variant="light"

>

<IconUser size={14}/>

</Avatar>





<Text

size="xs"

fw={700}

style={{

cursor:"pointer"

}}

onClick={()=>{


setSelectedUser({

name:user,

ids:count.ids

});


setOpened(true);


}}

>

{user}

</Text>



</Group>





<Badge

size="sm"

variant="outline"

>

{count.count}

</Badge>




</Group>



))

}


</Stack>


}



</Card>



))

}



</Stack>





</Card>



))

}



</SimpleGrid>





{/* ================= USER MODAL ================= */}


<Modal
  dir="rtl"
  opened={opened}
  onClose={()=>setOpened(false)}
  title={
    selectedUser
      ?
      `قائمة المخالفات التي قام ${selectedUser.name} بإجراء عليها`
      :
      ""
  }
  centered

  styles={{
    title:{
      fontSize:"14px",
      fontWeight:700,
    }
  }}
>


<Stack>


<Text
  size="sm"
  c="dimmed"
  fw={700}
>
عدد المخالفات: {selectedUser?.ids?.length || 0}
</Text>



{
selectedUser?.ids?.map((id,index)=>(


<Card

key={`${id}-${index}`}

withBorder

radius="md"

p="sm"

>


<Group

justify="space-between"

>


<Text

fw={700}

>

رقم المخالفة

</Text>



<Badge

size="lg"

variant="light"

color="blue"

>

{id}

</Badge>



</Group>



</Card>



))

}



</Stack>



</Modal>





</Card>


);


}