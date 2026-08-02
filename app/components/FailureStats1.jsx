"use client";

import { useState } from "react";

import {
  Card,
  Text,
  Group,
  Badge,
  Stack,
  Divider,
  ThemeIcon,
  Avatar,
  Box,
  ActionIcon,
} from "@mantine/core";

import {
  IconMapPin,
  IconAlertTriangle,
  IconCircleCheck,
  IconClock,
  IconX,
  IconChevronDown,
  IconChevronUp,
  IconBuildingCommunity,
  IconUser,
} from "@tabler/icons-react";


export default function FailureStatsCollapsible({
  items = [],
  collapsible = true,
}) {
  


  const summaryOnlyStatuses = [
    "Resolved",
    "ResolutionRejected",
    "PendingSpValidation",
  ];



  const [openDistricts, setOpenDistricts] = useState({});
  const [openBlocks, setOpenBlocks] = useState({});
  const [openStatuses, setOpenStatuses] = useState({});




  const statusConfig = {

    Resolved: {
      label: "تم الحل",
      color: "green",
      bg: "#e9f8ee",
      icon: <IconCircleCheck size={16} />,
    },


    ResolutionRejected: {
      label: "رفض الحل",
      color: "red",
      bg: "#ffeaea",
      icon: <IconX size={16} />,
    },


    PendingSpValidation: {
      label: "بانتظار القبول",
      color: "gray",
      bg: "#f1f3f5",
      icon: <IconClock size={16} />,
    },


    InProgress: {
      label: "قيد التنفيذ",
      color: "orange",
      bg: "#fff4e0",
      icon: <IconClock size={16} />,
    },


    PendingFieldMonitorVerification: {
      label: "في انتظار التحقق الميداني",
      color: "cyan",
      bg: "#e7f5ff",
      icon: <IconClock size={16} />,
    },


    PendingSupervisorReview: {
      label: "قيد مراجعة AVTR",
      color: "violet",
      bg: "#f3f0ff",
      icon: <IconClock size={16} />,
    },

  };




  const stats = {};



  items.forEach((item) => {


    const district =
      item.districtName || "غير معروف";


    const block =
      item.blockName || "غير معروف";


    const status =
      item.status || "Unknown";



    let lastUser = null;



    if (
      !summaryOnlyStatuses.includes(status) &&
      item.activities?.length
    ) {

      lastUser =
        item.activities[
          item.activities.length - 1
        ]?.userName || "Unknown";

    }





    if (!stats[district]) {

      stats[district] = {
        total: 0,
        blocks: {},
      };

    }



    stats[district].total++;





    if (!stats[district].blocks[block]) {

      stats[district].blocks[block] = {
        total: 0,
        statuses: {},
      };

    }



    stats[district]
    .blocks[block]
    .total++;






    if (
      !stats[district]
      .blocks[block]
      .statuses[status]
    ) {


      stats[district]
      .blocks[block]
      .statuses[status] = {

        total: 0,
        users: {},

      };

    }





    stats[district]
    .blocks[block]
    .statuses[status]
    .total++;





    if (lastUser) {


      stats[district]
      .blocks[block]
      .statuses[status]
      .users[lastUser] =

      (
        stats[district]
        .blocks[block]
        .statuses[status]
        .users[lastUser] || 0
      ) + 1;


    }


  });




  return (

      <Box
      p="md"
      style={{
        background: "#f8fafc",
        minHeight: "100vh",
      }}
    >

      <Stack gap="sm">


        <Card
          radius="xl"
          p="md"
          shadow="sm"
          style={{
            background:
              "linear-gradient(135deg,#ff6b6b,#ff8787)",
            color:"#fff"
          }}
        >

          <Group justify="space-between">

            <div>

              <Text size="xs">
                إجمالي المخالفات
              </Text>

              <Text
                fw={900}
                size="42px"
              >
                {items.length}
              </Text>

            </div>


            <ThemeIcon
              size={55}
              radius="xl"
              variant="light"
              style={{
                background:"rgba(255,255,255,.2)"
              }}
            >
              <IconAlertTriangle size={28}/>
            </ThemeIcon>


          </Group>

        </Card>




        {
          Object.entries(stats).map(
            ([district,data]) => (

              <Card
                key={district}
                radius="lg"
                p="sm"
                shadow="xs"
              >


                <Group
                  justify="space-between"
                  style={{
                    cursor: collapsible ? "pointer" : "default"
                  }}

                  onClick={() => {

                    if(!collapsible) return;

                    setOpenDistricts({
                      ...openDistricts,
                      [district]:
                      !openDistricts[district]
                    })

                  }}
                >


                  <Group gap="xs">

                    <ThemeIcon
                      size={38}
                      radius="xl"
                      variant="light"
                      color="blue"
                    >

                      <IconMapPin size={20}/>

                    </ThemeIcon>


                    <div>

                      <Text
                        size="sm"
                        fw={700}
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




                  <Group gap="xs">

                    <Badge>
                      {data.total}
                    </Badge>


                    {
                      collapsible && (

                        <ActionIcon
                          variant="subtle"
                        >

                          {
                            openDistricts[district]
                            ?
                            <IconChevronUp size={18}/>
                            :
                            <IconChevronDown size={18}/>
                          }

                        </ActionIcon>

                      )
                    }


                  </Group>


                </Group>





                {
                  (!collapsible || openDistricts[district]) && (

                    <>

                    <Divider my="sm"/>


                    <Stack gap="xs">


                    {
                      Object.entries(data.blocks)
                      .map(([block,blockData]) => (


                        <Card
                          key={block}
                          radius="md"
                          p="xs"
                          withBorder
                        >


                          <Group
                            justify="space-between"
                            style={{
                              cursor: collapsible
                              ? "pointer"
                              : "default"
                            }}

                            onClick={() => {

                              if(!collapsible) return;


                              setOpenBlocks({
                                ...openBlocks,
                                [`${district}-${block}`]:
                                !openBlocks[
                                  `${district}-${block}`
                                ]
                              })


                            }}
                          >


                            <Group gap="xs">


                              <ThemeIcon
                                size={30}
                                radius="xl"
                                variant="light"
                                color="teal"
                              >

                                <IconBuildingCommunity size={16}/>

                              </ThemeIcon>


                              <Text
                                size="sm"
                                fw={600}
                              >
                                {block}
                              </Text>


                            </Group>



                            <Group gap={5}>


                              <Badge size="sm">
                                {blockData.total}
                              </Badge>



                              {
                                collapsible && (

                                  <ActionIcon
                                    size="xs"
                                    variant="subtle"
                                  >

                                  {
                                    openBlocks[
                                      `${district}-${block}`
                                    ]
                                    ?
                                    <IconChevronUp size={14}/>
                                    :
                                    <IconChevronDown size={14}/>
                                  }

                                  </ActionIcon>

                                )
                              }


                            </Group>


                          </Group>





                          {
                            (
                              !collapsible ||
                              openBlocks[
                                `${district}-${block}`
                              ]
                            )
                            &&

                            (

                            <Stack
                              mt="xs"
                              gap={6}
                            >


                            {
                              Object.entries(blockData.statuses)
                              .map(([status,statusData]) => (


                                <Card
                                  key={status}
                                  radius="md"
                                  p="xs"
                                  style={{
                                    background:
                                    statusConfig[status]?.bg ||
                                    "#f8f9fa"
                                  }}
                                >


                                  <Group
                                    justify="space-between"
                                    style={{
                                      cursor: collapsible
                                      ? "pointer"
                                      : "default"
                                    }}

                                    onClick={() => {

                                      if(!collapsible) return;


                                      setOpenStatuses({
                                        ...openStatuses,
                                        [`${district}-${block}-${status}`]:
                                        !openStatuses[
                                          `${district}-${block}-${status}`
                                        ]
                                      })


                                    }}
                                  >


                                    <Group gap="xs">


                                      <ThemeIcon
                                        size={28}
                                        radius="xl"
                                        variant="light"
                                        color={
                                          statusConfig[status]?.color || "gray"
                                        }
                                      >

                                        {statusConfig[status]?.icon}

                                      </ThemeIcon>


                                      <Text
                                        size="sm"
                                        fw={700}
                                      >
                                        {
                                          statusConfig[status]?.label ||
                                          status
                                        }
                                      </Text>


                                    </Group>



                                    <Badge size="sm">
                                      {statusData.total}
                                    </Badge>


                                  </Group>




                                  {
                                    (
                                      !collapsible ||
                                      openStatuses[
                                        `${district}-${block}-${status}`
                                      ]
                                    )
                                    &&
                                    !summaryOnlyStatuses.includes(status)
                                    &&

                                    (

                                    <Stack
                                      mt="xs"
                                      gap={5}
                                    >

                                      {
                                        Object.entries(statusData.users)
                                        .map(([user,count]) => (

                                          <Group
                                            key={user}
                                            justify="space-between"
                                            p={5}
                                            style={{
                                              background:"#fff",
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


                                              <Text size="xs">
                                                {user}
                                              </Text>

                                            </Group>


                                            <Badge size="xs">
                                             {Number(count || 0)}
                                            </Badge>


                                          </Group>

                                        ))
                                      }

                                    </Stack>

                                    )
                                  }


                                </Card>

                              ))
                            }


                            </Stack>

                            )

                          }


                        </Card>


                      ))
                    }


                    </Stack>


                    </>

                  )
                }


              </Card>

            )
          )
        }


      </Stack>


    </Box>

  );

}
