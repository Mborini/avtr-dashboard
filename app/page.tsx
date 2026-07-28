"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Container,
  Title,
  Paper,
  Loader,
  Button,
} from "@mantine/core";

import FailureTable from "./components/FailureTable";
import FailureFilters from "./components/FailureFilters";
import ActivitiesModal from "./components/ActivitiesModal";
import Link from "next/link";


type Activity = {
  activityType?: string;
  userName?: string;
  oldValue?: string;
  newValue?: string;
  commentsAr?: string;
  isAvtrStaff?: boolean;
  staffParty?: string;
  images?: string[];
  videos?: string[];
};


type Failure = {
  id?: number | string;
  status?: string;
  blockName?: string;
  districtName?: string;
  activities?: Activity[];
};


type StatusMap = Record<string, string>;



export default function Page() {


  const [items, setItems] = useState<Failure[]>([]);

  const [loading, setLoading] = useState<boolean>(false);



  const [district, setDistrict] = useState<string>("");



  const [searchId, setSearchId] = useState<string>("");
  const [searchStatus, setSearchStatus] = useState<string>("");
  const [searchBlock, setSearchBlock] = useState<string>("");
  const [searchDistrict, setSearchDistrict] = useState<string>("");
  const [searchUser, setSearchUser] = useState<string>("");



  const [opened, setOpened] = useState<boolean>(false);

  const [selectedActivities, setSelectedActivities] =
    useState<Activity[]>([]);




  const statusColors: StatusMap = {

    PendingSpValidation: "black",
    InProgress: "green",
    PendingSupervisorReview: "#be4bdb",
    PendingFieldMonitorVerification: "#228be6",
    Resolved: "green",
    ResolutionRejected: "orange",
    Rejected: "red",

  };




  const statusName: StatusMap = {

    PendingSpValidation: "في انتظار القبول",
    InProgress: "قيد التنفيذ",
    PendingSupervisorReview: "قيد مراجعة AVTR",
    PendingFieldMonitorVerification: "في انتظار التحقق الميداني",
    Resolved: "تم الحل",
    ResolutionRejected: "تم رفض الحل",
    Rejected: "مرفوض",

  };





  async function getData(): Promise<void> {

    try {

      setLoading(true);


      const params = new URLSearchParams({

        limit: "100000",
        offset: "0",

      });



      if (district.trim()) {

        params.append(
          "districtNames",
          district
        );

      }




      const response = await fetch(
        `/api/kpis?${params.toString()}`
      );



      if (!response.ok) {

        throw new Error(
          "Failed to fetch data"
        );

      }



      const data = await response.json();



      setItems(
        data.items || []
      );



    } catch(error) {

      console.log(error);


    } finally {

      setLoading(false);

    }

  }





  useEffect(() => {

    getData();

  }, []);






  const filteredItems = useMemo(() => {


    return items.filter((item) => {


      const matchId =

        !searchId ||

        String(item.id ?? "")

          .toLowerCase()

          .includes(
            searchId.toLowerCase()
          );




      const matchStatus =

        !searchStatus ||

        (item.status ?? "")

          .toLowerCase()

          .includes(
            searchStatus.toLowerCase()
          )

        ||

        (statusName[item.status ?? ""] ?? "")

          .toLowerCase()

          .includes(
            searchStatus.toLowerCase()
          );





      const matchBlock =

        !searchBlock ||

        (item.blockName ?? "")

          .toLowerCase()

          .includes(
            searchBlock.toLowerCase()
          );






      const matchDistrict =

        !searchDistrict ||

        (item.districtName ?? "")

          .toLowerCase()

          .includes(
            searchDistrict.toLowerCase()
          );






      const matchUser =

        !searchUser ||

        item.activities?.some(

          (activity) =>

            (activity.userName ?? "")

              .toLowerCase()

              .includes(
                searchUser.toLowerCase()
              )

        );






      return (

        matchId &&
        matchStatus &&
        matchBlock &&
        matchDistrict &&
        matchUser

      );


    });


  }, [

    items,
    searchId,
    searchStatus,
    searchBlock,
    searchDistrict,
    searchUser

  ]);






  function openActivities(
    activities: Activity[] = []
  ): void {


    setSelectedActivities(
      activities
    );


    setOpened(true);

  }





  return (

    <Container size="xl" py="xl">


      <Title mb="lg">
        Failures Dashboard
      </Title>



      <Link href="/failures/stats">

        <Button

          mb="lg"

          radius="xl"

          variant="gradient"

          gradient={{
            from: "blue",
            to: "cyan",
          }}

        >

          عرض الإحصائيات

        </Button>


      </Link>




      <Paper

        shadow="sm"

        p="lg"

        radius="md"

      >



        <FailureFilters

          district={district}
          setDistrict={setDistrict}

          searchId={searchId}
          setSearchId={setSearchId}

          searchStatus={searchStatus}
          setSearchStatus={setSearchStatus}

          searchBlock={searchBlock}
          setSearchBlock={setSearchBlock}

          searchDistrict={searchDistrict}
          setSearchDistrict={setSearchDistrict}

          searchUser={searchUser}
          setSearchUser={setSearchUser}

          onLoad={getData}

        />



        {
          loading

          ?

          <Loader />

          :

          <FailureTable

            items={filteredItems}

            statusColors={statusColors}

            statusName={statusName}

            onOpenActivities={openActivities}

          />

        }



      </Paper>




      <ActivitiesModal

        opened={opened}

        onClose={() =>
          setOpened(false)
        }

        activities={
          selectedActivities
        }

      />



    </Container>

  );

}