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
} from "@mantine/core";

import FailureStatsCollapsible from "../../components/FailureStats1";
import FailureStats from "../../components/Failures/FailureStats";



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
      size="xl"
      py="xl"
    >


     <Card
  withBorder
  shadow="sm"
  radius="lg"
  p="lg"
  mb="xl"
>

  <Group
    justify="space-between"
    align="center"
    mb="lg"
  >

    <Title
      order={2}
    >
      إحصائيات المخالفات
    </Title>


    <Switch

      size="md"

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





  <Group
    align="end"
    gap="md"
  >


    <div>

      <Text
        size="sm"
        fw={600}
        mb={6}
      >
        من تاريخ
      </Text>


      <input

        type="date"

        value={dateFrom}

        onChange={(e)=>
          setDateFrom(
            e.target.value
          )
        }


        style={{
          height:"38px",
          borderRadius:"8px",
          border:"1px solid #ced4da",
          padding:"0 12px",
          fontSize:"14px",
          background:"#fff",
          width:"180px"
        }}

      />

    </div>





    <div>

      <Text
        size="sm"
        fw={600}
        mb={6}
      >
        إلى تاريخ
      </Text>


      <input

        type="date"

        value={dateTo}

        onChange={(e)=>
          setDateTo(
            e.target.value
          )
        }


        style={{
          height:"38px",
          borderRadius:"8px",
          border:"1px solid #ced4da",
          padding:"0 12px",
          fontSize:"14px",
          background:"#fff",
          width:"180px"
        }}

      />

    </div>





    <Button

      size="md"

      radius="md"

      loading={loading}

      onClick={getData}

    >

      عرض النتائج

    </Button>



  </Group>



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