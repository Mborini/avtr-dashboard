"use client";

import {
  Card,
  Text,
  Group,
  Badge,
  Stack,
  Divider,
  SimpleGrid,
  Avatar,
} from "@mantine/core";


import {
  IconMapPin,
} from "@tabler/icons-react";


import {
  statusConfig,
  summaryOnlyStatuses
} from "./statusConfig";



export default function DistrictCard({
  district,
  data
}) {



  // ==================================
  // تجميع الحالات لكل منطقة
  // وإضافة الحالات غير الموجودة بقيمة 0
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


<Group justify="space-between">


<Group gap="sm">


<Badge
size="xl"
radius="xl"
variant="light"
color="blue"
>

<IconMapPin size={18}/>

</Badge>



<div>

<Text
fw={800}
size="md"
>
{district}
</Text>


<Text
size="xs"
c="dimmed"
>
عدد المخالفات في المنطقة
</Text>


</div>


</Group>




<Badge
size="lg"
radius="xl"
variant="light"
color="blue"
>

{data.total}

</Badge>



</Group>





{/* ================= STATUS SUMMARY ================= */}


<Card

mt="md"

radius="lg"

p="sm"

style={{

background:"#f8fafc",

border:"1px solid #edf2f7"

}}

>


<Text
fw={700}
size="sm"
mb="xs"
>

ملخص الحالات

</Text>




<Group
gap="xs"
wrap="wrap"
>


{
Object.entries(districtStatuses)
.map(([status,count])=>(


<Badge

key={status}

size="lg"

radius="xl"

variant="light"

color={
statusConfig[status]?.color ||
"gray"
}

>

{
statusConfig[status]?.label ||
status
}

&nbsp;

({count})


</Badge>


))
}



</Group>



</Card>





<Divider my="md"/>





{/* ================= BLOCKS ================= */}



<SimpleGrid

cols={{

base:1,

sm:2,

md:3

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


<Text
fw={700}
size="sm"
>

📍 {block}

</Text>



<Badge
size="sm"
variant="light"
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
statusConfig[status]?.bg ||
"#f8f9fa",

border:"none"

}}

>




<Group

justify="space-between"

>



<Group gap={6}>


{
statusConfig[status]?.icon
}



<Text
fw={600}
size="sm"
>

{
statusConfig[status]?.label ||
status
}


</Text>



</Group>





<Badge

size="sm"

color={
statusConfig[status]?.color ||
"gray"
}

variant="light"

>

{statusData.total}

</Badge>



</Group>






{/* المستخدمين */}

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

background:
"rgba(255,255,255,.7)",

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

{user.charAt(0)}

</Avatar>



<Text size="xs">

{user}

</Text>



</Group>




<Badge

size="sm"

variant="outline"

>

{count}

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



</Card>

);

}