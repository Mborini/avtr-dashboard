"use client";

import { useMemo } from "react";

import {
  Box,
  Card,
  Group,
  Text,
  Stack,
  SimpleGrid,
  Badge
} from "@mantine/core";

import DistrictCard from "./DistrictCard";

import {
  statusConfig,
  summaryOnlyStatuses
} from "./statusConfig";




export default function FailureStats({
  items = []
}) {



  // ==================================
  // تجميع المناطق والمستخدمين
  // ==================================

  const stats = useMemo(() => {


    const result = {};



    items.forEach(item => {


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
          item.activities.at(-1)?.userName ||
          "Unknown";

      }





      if (!result[district]) {

        result[district] = {

          total: 0,

          blocks: {}

        };

      }



      result[district].total++;





      if (!result[district].blocks[block]) {

        result[district].blocks[block] = {

          total: 0,

          statuses: {}

        };

      }



      const blockData =
        result[district].blocks[block];



      blockData.total++;





      if (!blockData.statuses[status]) {

        blockData.statuses[status] = {

          total: 0,

          users: {}

        };

      }



      blockData.statuses[status].total++;





      if (lastUser) {


        if (
          !blockData.statuses[status]
            .users[lastUser]
        ) {

          blockData.statuses[status]
            .users[lastUser] = {

            count: 0,

            ids: []

          };

        }




        blockData.statuses[status]
          .users[lastUser]
          .count++;




        if (
          !blockData.statuses[status]
            .users[lastUser]
            .ids.includes(item.id)
        ) {

          blockData.statuses[status]
            .users[lastUser]
            .ids.push(item.id);

        }



      }


    });



    return result;


  }, [items]);







  // ==================================
  // الحالات العامة
  // ==================================

  const totalStatuses = useMemo(() => {


    const result = {};



    Object.keys(statusConfig)
      .forEach(status => {

        result[status] = 0;

      });





    items.forEach(item => {


      const status =
        item.status || "Unknown";



      result[status] =
        (result[status] || 0) + 1;


    });



    return result;


  }, [items]);







  // ==================================
  // KPI
  // ==================================

  const kpis = useMemo(() => {


    const total =
      items.length;



    const field =
      totalStatuses
        .PendingFieldMonitorVerification || 0;



    const resolved =
      totalStatuses.Resolved || 0;





    return {


      total,


      fieldPercentage:
        total
          ?
          ((field / total) * 100)
            .toFixed(1)
          :
          0,



      resolvedPercentage:
        total
          ?
          ((resolved / total) * 100)
            .toFixed(1)
          :
          0


    };


  }, [
    items,
    totalStatuses
  ]);






  const achievement =
    (
      (
        Number(kpis.fieldPercentage) +
        Number(kpis.resolvedPercentage)
      )

    )
      .toFixed(1);







  return (


    <Box

      p={{ base: "sm", md: "lg" }}

      style={{

        background: "#f8fafc",

        minHeight: "100vh"

      }}

    >



      <Stack gap="lg">







        {/* ============================
      SUMMARY HEADER
============================ */}



        <Card

          radius="30"

          p="xl"

          withBorder

          style={{

            background: "#ffffff",

            boxShadow:
              "0 10px 30px rgba(0,0,0,.05)"

          }}

        >



          <Stack gap="xl">





            <Text

              ta="center"

              size="xl"

              fw={900}

            >

              ملخص المخالفات لجميع المناطق
            </Text>







            <Box

              style={{

                textAlign: "center"

              }}

            >



              <Text

                fw={900}

                size="64px"

                c="#228be6"

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

              spacing="md"

            >



              <MiniStat

                title="الاجمالي الكلي "

                value={kpis.total}

              />



              <MiniStat

                title="نسبة التحقق الميداني"

                value={`${kpis.fieldPercentage}%`}

              />



              <MiniStat

                title="نسبة تم الحل"

                value={`${kpis.resolvedPercentage}%`}

              />



            </SimpleGrid>







            {/* الحالات */}



            <Card

              radius="24"

              p="lg"

              style={{

                background: "#f8f9fa",

                display: "flex",

                flexDirection: "column",

                alignItems: "center",

                gap: "md"

              }}

            >


              <Text

                fw={900}
                pb={10}
                size="sm"

              >

                توزيع الأعداد حسب الحالة</Text>





              <Group

                gap="sm"

                justify="center"

                wrap="wrap"

              >


                {

                  Object.entries(totalStatuses)

                    .map(([status, count]) => (


                      <Badge

                        key={status}

                        radius="xl"

                        px="md"

                        py={10}

                        size="lg"

                        variant="light"

                        color={
                          statusConfig[status]?.color || "gray"
                        }

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



              </Group>



            </Card>







          </Stack>


        </Card>









        {/* ============================
      DISTRICTS
============================ */}



        <Stack gap="md">


          {

            Object.entries(stats)

              .map(([district, data]) => (


                <DistrictCard

                  key={district}

                  district={district}

                  data={data}

                />


              ))


          }



        </Stack>





      </Stack>



    </Box>


  );



}









function MiniStat({

  title,

  value

}) {


  return (

    <Box

      style={{

        background: "#f8f9fa",

        borderRadius: "20px",

        padding: "18px",

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

        size="30px"

        fw={900}

      >

        {value}

      </Text>



    </Box>


  );


}