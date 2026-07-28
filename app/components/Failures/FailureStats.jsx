"use client";


import {
Box,
Card,
Group,
Text,
ThemeIcon,
Stack
} from "@mantine/core";


import {
IconAlertTriangle
} from "@tabler/icons-react";


import DistrictCard from "./DistrictCard";

import {
summaryOnlyStatuses
} from "./statusConfig";



export default function FailureStats({
items=[]
}){


const stats={};


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



if(lastUser){

blockData.statuses[status]
.users[lastUser]=
(blockData.statuses[status]
.users[lastUser] || 0)+1;

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


<Stack>


<Card
radius="xl"
style={{
background:
"linear-gradient(135deg,#ff6b6b,#ff8787)",
color:"white"
}}
>


<Group justify="space-between">


<div>

<Text size="xs">
إجمالي المخالفات
</Text>


<Text size="42px" fw={900}>
{items.length}
</Text>


</div>


<ThemeIcon size={60}>
<IconAlertTriangle/>
</ThemeIcon>


</Group>


</Card>



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


)


}