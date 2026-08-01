"use client";

import { useEffect, useState } from "react";

import {
  Container,
  Loader,
  Title,
  Button,
  Group,
  Switch,
  Card,
  Text,
  Center,
  Stack,
} from "@mantine/core";

import FailureStatsCollapsible from "../../components/FailureStats1";
import FailureStats from "../../components/Failures/FailureStats";
import {
  IconSearch,
  IconCalendar,
  IconChartBar,
  IconChartBarOff
} from "@tabler/icons-react";


export default function StatsPage() {


  function getToday(){

    const date = new Date();

    return `${date.getFullYear()}-${String(
      date.getMonth()+1
    ).padStart(2,"0")}-${String(
      date.getDate()
    ).padStart(2,"0")}`;

  }




  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(false);

  const [showCollapsible, setShowCollapsible] = useState(false);



  const [dateFrom, setDateFrom] = useState(
    getToday()
  );


  const [dateTo, setDateTo] = useState(
    getToday()
  );





  function getDateRange(date){


    const current = new Date(date);


    const year = current.getFullYear();

    const month = String(
      current.getMonth()+1
    ).padStart(2,"0");

    const day = String(
      current.getDate()
    ).padStart(2,"0");



    const previous = new Date(current);

    previous.setDate(
      previous.getDate()-1
    );



    const previousYear =
      previous.getFullYear();


    const previousMonth =
      String(previous.getMonth()+1)
      .padStart(2,"0");


    const previousDay =
      String(previous.getDate())
      .padStart(2,"0");



    return {

      from:
      `${previousYear}-${previousMonth}-${previousDay}T21:00:00.000Z`,


      to:
      `${year}-${month}-${day}T20:59:59.999Z`

    };


  }





  async function getData(){


    try{


      setLoading(true);



      const params = new URLSearchParams();



      const range =
        getDateRange(dateFrom);



      params.append(
        "dateFrom",
        range.from
      );


      params.append(
        "dateTo",
        range.to
      );



      params.append(
        "limit",
        "100000"
      );


      params.append(
        "offset",
        "0"
      );



      console.log({
        dateFrom: range.from,
        dateTo: range.to
      });



      const response = await fetch(
        `/api/kpis?${params.toString()}`
      );



      const data =
        await response.json();



      setItems(
        data.items || []
      );



    }
    catch(error){

      console.log(error);

    }
    finally{

      setLoading(false);

    }


  }





  useEffect(()=>{

    getData();

  },[]);






  return (

    <Container
    dir="rtl"
      size="xl"
      py="xl"
    >

<Card
  withBorder
  shadow="sm"
  radius="30"
  p={{ base: "md", sm: "xl" }}
  mb="xl"
  style={{
    background: "#ffffff",
    border: "1px solid #edf2f7",
    boxShadow: "0 10px 35px rgba(0,0,0,.05)"
  }}
>

  <Stack
    align="center"
    gap="lg"
    w="100%"
  >


    {/* ================= TITLE ================= */}

    <Title
      order={2}
      ta="center"
      fw={900}
      c="#1c7ed6"
      style={{
        fontSize: "clamp(20px,4vw,30px)",
        lineHeight: 1.3
      }}
    >
منصة الرصد والتحليل التشغيلي للمخالفات ومؤشرات الأداء   </Title>



    {/* ================= FILTERS ================= */}


    <Group
      justify="center"
      align="center"
      gap="md"
      wrap="wrap"
      w="100%"
    >



      {/* FROM DATE */}

      <Group
        gap="xs"
        align="center"
        justify="center"
        wrap="wrap"
      >

        <Text
          size="sm"
          fw={700}
        >
          من تاريخ
        </Text>


        <input

          type="date"

          value={dateFrom}

          onChange={(e)=>
            setDateFrom(e.target.value)
          }

          style={{

            height:"30px",

            borderRadius:"14px",

            border:"1px solid #dee2e6",

            padding:"0 12px",

            fontSize:"13px",

            background:"#f8fafc",

            width:"140px",

            outline:"none"

          }}

        />


      </Group>





      {/* TO DATE */}


      <Group
        gap="xs"
        align="center"
        justify="center"
        wrap="wrap"
      >

        <Text
          size="sm"
          fw={700}
        >
          إلى تاريخ
        </Text>


        <input

          type="date"

          value={dateTo}

          onChange={(e)=>
            setDateTo(e.target.value)
          }

           style={{

            height:"30px",

            borderRadius:"14px",

            border:"1px solid #dee2e6",

            padding:"0 12px",

            fontSize:"13px",

            background:"#f8fafc",

            width:"140px",

            outline:"none"

          }}

        />


      </Group>





      {/* SEARCH BUTTON */}


      <Button

        size="sm"

        radius="xl"

        loading={loading}

        px="lg"

        w={{
          base:"75%",
          sm:"auto"
        }}

        style={{

          height:"30px"

        }}

        onClick={getData}

      >

        استعلام

      </Button>





      {/* SWITCH */}


      <Switch

        size="sm"

        label={
          showCollapsible
            ? "العرض التفصيلي"
            : "العرض المختصر"
        }

        checked={showCollapsible}

        onChange={(event)=>
          setShowCollapsible(
            event.currentTarget.checked
          )
        }

      />



    </Group>


  </Stack>


</Card>



{
  loading ?

  <Center
    style={{
      height: "300px"
    }}
  >

    <Loader
      size="lg"
    />

  </Center>


  :


  showCollapsible ?


  <FailureStatsCollapsible
    items={items}
  />


  :


  <FailureStats
    items={items}
  />

}





    </Container>

  );


}