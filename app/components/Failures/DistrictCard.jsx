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
  Button,
  Box,
} from "@mantine/core";

import {
  IconBuildings,
  IconEye,
  IconLiveView,
  IconMapPin,
  IconUser,
} from "@tabler/icons-react";

import FailureListModal from "../FailureListModal";
import {
  statusConfig,
  summaryOnlyStatuses
} from "./statusConfig";



export default function DistrictCard({
  district,
  data
}) {

const [failureModalOpened,setFailureModalOpened] = useState(false);


const [selectedFailures,setSelectedFailures] = useState([]);


const [selectedStatus,setSelectedStatus] = useState("");
const [selectedStatusKey,setSelectedStatusKey] = useState("");
  const [opened, setOpened] = useState(false);

  const [selectedUser, setSelectedUser] = useState(null);


  // Modal ملخص الحالات
  const [summaryModalOpened, setSummaryModalOpened] = useState(false);


  // Modal ملخص المستخدمين
  const [usersModalOpened, setUsersModalOpened] = useState(false);

  // ==================================
  // تجميع الحالات لكل منطقة
  // ==================================

  const districtStatuses = {};

  // ==================================
  // تجميع المستخدمين حسب الحالة
  // ==================================

  const districtUsersByStatus = {};



  Object.values(data.blocks || {})
    .forEach((block) => {


      Object.entries(block.statuses || {})
        .forEach(([status, statusData]) => {


          if (
            !districtUsersByStatus[status]
          ) {

            districtUsersByStatus[status] = {};

          }



          Object.entries(
            statusData.users || {}
          )
            .forEach(([user, userData]) => {


              if (
                !districtUsersByStatus[status][user]
              ) {

                districtUsersByStatus[status][user] = {
                  count: 0,
                  ids: []
                };

              }



              districtUsersByStatus[status][user].count
                += userData.count;



              districtUsersByStatus[status][user].ids
                =
                [
                  ...districtUsersByStatus[status][user].ids,
                  ...(userData.ids || [])
                ];



            });



        });



    });
  Object.keys(statusConfig).forEach((status) => {

    districtStatuses[status] = 0;

  });



  Object.values(data.blocks || {})
    .forEach((block) => {


      Object.entries(block.statuses || {})
        .forEach(([status, statusData]) => {


          if (districtStatuses[status] === undefined) {

            districtStatuses[status] = 0;

          }


          districtStatuses[status] += statusData.total;


        });


    });



  const usersByStatus = {};

  Object.keys(statusConfig).forEach((status) => {
    usersByStatus[status] = {};
  });

  Object.values(data.blocks || {}).forEach((block) => {

    Object.entries(block.statuses || {}).forEach(([status, statusData]) => {

      if (summaryOnlyStatuses.includes(status)) return;

      Object.entries(statusData.users || {}).forEach(([user, userData]) => {


        if (!usersByStatus[status]) {
          usersByStatus[status] = {};
        }


        if (!usersByStatus[status][user]) {
          usersByStatus[status][user] = 0;
        }


        usersByStatus[status][user] += userData.count;


      });

    });

  });
  const districtColors = {

    "طارق": {
      main: "#228be6",
      light: "#e7f5ff"
    },

    "الجبيهة": {
      main: "#099268",
      light: "#ebfbee"
    },

    "ابو نصير": {
      main: "#fa5252",
      light: "#ffe3e3"
    },

    "شفا بدران": {
      main: "#f59f00",
      light: "#fff9db"
    },

    "ماركا": {
      main: "#fa5252",
      light: "#fff5f5"
    },

    "المدينة": {
      main: "#15aabf",
      light: "#e3fafc"
    }

  };

  const districtTotal =
    data.total || 0;


  const fieldCount =
    districtStatuses.PendingFieldMonitorVerification || 0;


  const resolvedCount =
    districtStatuses.Resolved || 0;



  const fieldPercentage =
    districtTotal
      ? ((fieldCount / districtTotal) * 100).toFixed(1)
      : 0;



  const resolvedPercentage =
    districtTotal
      ? ((resolvedCount / districtTotal) * 100).toFixed(1)
      : 0;



  const achievement =
    (
      Number(fieldPercentage) +
      Number(resolvedPercentage)
    ).toFixed(1);

  const districtTheme =
    districtColors[district] || {
      main: "#868e96",
      light: "#f1f3f5"
    };


    const exportDistrictExcel = () => {


  const rows = [];


  Object.entries(data.blocks || {})
    .forEach(([block, blockData]) => {


      const row = {

        "المنطقة": district,

        "الحي": block,

        "إجمالي المخالفات":
          blockData.total,


        "في انتظار القبول": 0,

        "قيد التنفيذ": 0,

        "قيد مراجعة AVTR": 0,

        "انتظار التحقق الميداني": 0,

        "تم الحل": 0,

        "تم رفض الحل": 0,

        "مرفوض": 0,

      };



      Object.entries(blockData.statuses || {})
        .forEach(([status,statusData])=>{


          const map = {

            PendingSpValidation:
            "في انتظار القبول",

            InProgress:
            "قيد التنفيذ",

            PendingSupervisorReview:
            "قيد مراجعة AVTR",

            PendingFieldMonitorVerification:
            "انتظار التحقق الميداني",

            Resolved:
            "تم الحل",

            ResolutionRejected:
            "تم رفض الحل",

            Rejected:
            "مرفوض"

          };


          const key = map[status];


          if(key){

            row[key] =
              statusData.total;

          }


        });



      const field =
        row["انتظار التحقق الميداني"] || 0;


      const resolved =
        row["تم الحل"] || 0;



      row["نسبة الإنجاز"] =
        blockData.total
        ?
        (((field + resolved) /
        blockData.total)*100)
        .toFixed(1)+"%"
        :
        "0%";



      rows.push(row);


    });



  // إضافة Footer

  const total = {

    "الحي":"المجموع"

  };


  Object.keys(rows[0])
  .forEach(key=>{


    if(
      key !== "المنطقة" &&
      key !== "الحي" &&
      key !== "نسبة الإنجاز"
    ){

      total[key] =
      rows.reduce(
        (sum,row)=>
        sum + Number(row[key]||0),
        0
      );

    }


  });



  rows.push(total);



  const sheet =
    XLSX.utils.json_to_sheet(rows);



  const book =
    XLSX.utils.book_new();



  XLSX.utils.book_append_sheet(
    book,
    sheet,
    district
  );



  XLSX.writeFile(
    book,
    `تقرير_${district}.xlsx`
  );


};
  return (

    <Card

      radius="xl"

      p="md"

      shadow="xs"


    >



      {/* ================= HEADER ================= */}


      <Group
        justify="space-between"
        align="center"
        mb="xs"
        style={{
          position: "relative",
          minHeight: 50,
        }}
      >

        {/* اسم المنطقة بالمنتصف الحقيقي */}
        <Group
          gap="sm"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            width: "max-content",
            maxWidth: "70%",
          }}
        >

          <Badge
            size="xl"
            radius="xl"
            variant="filled"
            p={8}
            style={{
              background: districtTheme.main,
              flexShrink: 0,
            }}
          >
            <IconBuildings size={20} />
          </Badge>


          <Text
            fw={900}
            c={districtTheme.main}
            ta="center"
            style={{
              fontSize: "clamp(20px, 4vw, 32px)",
              lineHeight: 1.1,
              letterSpacing: "-0.5px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            منطقة {district}
          </Text>

        </Group>


        {/* الزر يمين */}



      </Group>
      <Card

        radius="30"

        p="lg"

        mt="md"
        mb={10}
        withBorder

        style={{

          background: "#ffffff",

          boxShadow:
            "0 10px 30px rgba(0,0,0,.05)"

        }}

      >


        <Stack gap="md">


          <Box

            style={{

              textAlign: "center"

            }}

          >



            <Text

              ta="center"

              fw={900}

              size="48px"

              c={districtTheme.main}

            >

              {achievement}%

            </Text>



            <Text

              fw={700}

              c="dimmed"

            >

              نسبة الإنجاز الكلي

            </Text>



          </Box>






          <SimpleGrid

            cols={{

              base: 1,

              sm: 3

            }}

            spacing="sm"

          >


            <BoxStat

              title="الاجمالي الكلي"

              value={districtTotal}

            />


            <BoxStat

              title="نسبة التحقق الميداني"

              value={`${fieldPercentage}%`}

            />


            <BoxStat

              title="نسبة تم الحل"

              value={`${resolvedPercentage}%`}

            />


          </SimpleGrid>


        </Stack>
        <Card

          radius="24"
          p="xs"
          mt="md"
          mb="md"
          style={{

            background: "#f8f9fa",

            display: "flex",

            flexDirection: "column",

            alignItems: "center",

            gap: "sm"

          }}

        >


          <Text

            fw={900}
            mb={10}
            size="lg"

          >

            توزيع الأعداد حسب الحالة

          </Text>



          <Group

            gap="sm"

            justify="center"

            wrap="wrap"

          >


            {

              Object.entries(districtStatuses)

                .map(([status, count]) => (


                <Badge

 key={status}

 size="lg"

 radius="xl"

 px="md"

 py={10}

 variant="light"

 color={
   statusConfig[status]?.color || "gray"
 }

 style={{
   cursor:"pointer"
 }}

onClick={()=>{


const failureMap = new Map();


Object.entries(data.blocks || {})
.forEach(([blockName, blockData])=>{


const statusData =
blockData.statuses?.[status];


if(!statusData)
return;



Object.values(statusData.users || {})
.forEach(user=>{


(user.ids || []).forEach(id=>{


failureMap.set(id,{

id,

district,

block:blockName

});


});


});



(statusData.ids || [])
.forEach(id=>{


failureMap.set(id,{

id,

district,

block:blockName

});


});


});



const failures = Array.from(
  failureMap.values()
);



setSelectedFailures(failures);







setSelectedFailures(failures);



setSelectedStatus(
 statusConfig[status]?.label || status
);

setSelectedStatusKey(status);

setFailureModalOpened(true);


}}

>
                    <Group

                      gap={8}

                      wrap="nowrap"

                    >


                      <Text

                        size="xs"

                        fw={700}

                      >

                        {
                          statusConfig[status]?.label || status
                        }

                      </Text>


                      {count}


                    </Group>


                  </Badge>


                ))

            }

            <Badge
              radius="xl"
              size="lg"
              color="#66a80f"
              variant="light"
              onClick={() => setUsersModalOpened(true)}
              leftSection={<IconEye size={16} />}
              style={{
                marginLeft: "auto",
              }}
            >
              استعرض انجازات كل مستخدم 
               </Badge>
          </Group>


        </Card>

      </Card>

      {/* ================= BLOCKS ================= */}


      {/* ================= STATUS SUMMARY ================= */}



      <SimpleGrid

        cols={{

          base: 1,

          sm: 4,

          md: 5

        }}

        spacing="xs"

      >


        {
          Object.entries(data.blocks || {})
            .map(([block, blockData]) => (

              <Card

                key={block}

                radius="md"

                p="xs"

                shadow="xs"

                style={{

                  background:
                    "rgba(255,255,255,0.45)",

                  backdropFilter:
                    "blur(14px)",

                  WebkitBackdropFilter:
                    "blur(14px)",

                  border:
                    "1px solid rgba(255,255,255,0.6)",

                  boxShadow:
                    "0 8px 30px rgba(0,0,0,0.08)"

                }}

              >


                {/* HEADER BLOCK */}

                <Group

                  justify="space-between"

                  mb={5}

                >


                  <Group gap={5}>


                    <Badge

                      size="sm"

                      radius="xl"

                      variant="light"

                      color="blue"

                      p={5}

                    >

                      <IconMapPin size={14} />

                    </Badge>



                    <Text

                      fw={700}

                      size="md"

                    >

                      حي {block}

                    </Text>


                  </Group>



                  <Badge

                    size="md"

                    radius="xl"

                    variant="filled"

                    color="blue"

                  >

                    {blockData.total}

                  </Badge>


                </Group>




                <Stack gap={4}>


                  {
                    Object.entries(blockData.statuses || {})
                      .map(([status, statusData]) => (


                        <Card

                          key={status}

                          radius="sm"

                          p={6}

                          style={{

                            background:
                              statusConfig[status]?.bg || "#fff",

                            border: "none"

                          }}

                        >



                          <Group

                            justify="space-between"

                          >


                            <Group gap={5}>


                              {statusConfig[status]?.icon}



                              <Text

                                fw={600}

                                size="xs"

                              >

                                {
                                  statusConfig[status]?.label || status
                                }

                              </Text>


                            </Group>



                            <Badge

                              size="xs"

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

                              mt={5}

                              gap={4}

                            >


                              {
                                Object.entries(statusData.users || {})
                                  .map(([user, count]) => (


                                    <Group

                                      key={user}

                                      justify="space-between"

                                      p={4}

                                      style={{

                                        background:
                                          "rgba(255,255,255,.7)",

                                        borderRadius: 6

                                      }}

                                    >


                                      <Group gap={5}>


                                        <Avatar

                                          size="xs"

                                          radius="xl"

                                          color="blue"

                                          variant="light"

                                        >

                                          <IconUser size={11} />

                                        </Avatar>



                                        <Text

                                          size="10px"

                                          fw={700}

                                          style={{

                                            cursor: "pointer"

                                          }}

                                          onClick={() => {

                                            setSelectedUser({

                                              name: user,

                                              ids: count.ids

                                            });


                                            setOpened(true);

                                          }}

                                        >

                                          {user}

                                        </Text>


                                      </Group>




                                      <Badge

                                        size="xs"

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
        onClose={() => setOpened(false)}
        title={
          selectedUser
            ?
            `قائمة المخالفات التي قام ${selectedUser.name} بإجراء عليها`
            :
            ""
        }
        centered

        styles={{
          title: {
            fontSize: "14px",
            fontWeight: 700,
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
            selectedUser?.ids?.map((id, index) => (


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



      <Modal
        dir="rtl"
        opened={summaryModalOpened}
        onClose={() => setSummaryModalOpened(false)}
        centered
        size="lg"
        title="ملخص حالات المخالفات حسب المنطقة"
        styles={{
          title: {
            fontSize: "15px",
            fontWeight: 800
          }
        }}
      >


        <SimpleGrid
          cols={{
            base: 1,
            sm: 3
          }}
          spacing="sm"
        >


          {
            Object.entries(districtStatuses)
              .map(([status, count]) => (


                <Card

                  key={status}

                  radius="lg"

                  p="md"

                  style={{

                    textAlign: "center",

                    background:
                      statusConfig[status]?.bg || "#fff",

                    border: "1px solid #edf2f7"

                  }}

                >


                  <Text

                    size="sm"

                    fw={700}

                    c="dimmed"

                    mb={5}

                  >

                    {
                      statusConfig[status]?.label || status
                    }

                  </Text>



                  <Text

                    size="xl"

                    fw={900}

                  >

                    {count}

                  </Text>



                </Card>


              ))

          }



        </SimpleGrid>



      </Modal><Modal
        dir="rtl"
        opened={usersModalOpened}
        onClose={() => setUsersModalOpened(false)}
        centered
        size="lg"
        title="ملخص حالات المخالفات حسب المستخدمين"
        styles={{
          title: {
            fontSize: "15px",
            fontWeight: 800
          }
        }}
      >


        <Stack gap="sm">


          {
            Object.entries(districtUsersByStatus)
              .map(([status, users]) => (


                <Card

                  key={status}

                  radius="lg"

                  p="md"

                  style={{

                    background:
                      statusConfig[status]?.bg || "#fff",

                    border: "1px solid #edf2f7"

                  }}

                >


                  <Group
                    justify="space-between"
                    mb="sm"
                  >


                    <Text

                      fw={800}

                      size="sm"

                    >

                      {
                        statusConfig[status]?.label || status
                      }

                    </Text>



                    <Badge

                      color={
                        statusConfig[status]?.color || "gray"
                      }

                      variant="light"

                    >

                      {
                        Object.values(users)
                          .reduce(
                            (sum, user) => sum + user.count,
                            0
                          )
                      }

                    </Badge>


                  </Group>





                  <Stack gap={6}>


                    {
                      Object.entries(users)
                        .map(([user, userData]) => (


                          <Group

                            key={user}

                            justify="space-between"

                            p="xs"

                            style={{

                              background: "#ffffff",

                              borderRadius: 8

                            }}

                          >


                            <Group gap="xs">


                              <Avatar

                                size="sm"

                                color="blue"

                                variant="light"

                              >

                                {user.charAt(0)}

                              </Avatar>



                              <Text

                                size="sm"

                                fw={700}

                              >

                                {user}

                              </Text>


                            </Group>




                            <Badge

                              variant="outline"

                            >

                              {userData.count}

                            </Badge>



                          </Group>


                        ))

                    }


                  </Stack>



                </Card>


              ))


          }



        </Stack>



      </Modal>
    


    <FailureListModal

opened={failureModalOpened}

onClose={() =>
setFailureModalOpened(false)
}

title={`قائمة مخالفات ${selectedStatus}`}

failures={selectedFailures}

status={selectedStatusKey}

/>

    </Card>
    


  );

  function BoxStat({
    title,
    value
  }) {

    return (

      <Card

        radius="20"

        p="md"

        style={{

          background: "#f8f9fa",

          textAlign: "center"

        }}

      >


        <Text

          size="xs"

          fw={700}

          c="dimmed"

        >

          {title}

        </Text>


        <Text

          size="28px"

          fw={900}

        >

          {value}

        </Text>


      </Card>

    );

  }
  
}