"use client";

import {
  Modal,
  Stack,
  Card,
  Group,
  Text,
  Badge,
  Checkbox,
  Button,
  PasswordInput,
  Divider
} from "@mantine/core";

import { useState } from "react";

import * as XLSX from "xlsx";

export default function FailureListModal({

  opened,
  onClose,
  title,
  failures = [],
  status


}) {



  const [selectedIds, setSelectedIds] = useState([]);

  const [confirmOpened, setConfirmOpened] = useState(false);

  const [code, setCode] = useState("");

const [loading, setLoading] = useState(false);


const allowPayment =
  status === "PendingSpValidation";
  // =============================
  // تحديد الكل
  // =============================

  const selectAll = () => {


    if(selectedIds.length === failures.length){


      setSelectedIds([]);


    }
    else{


      setSelectedIds(
        failures.map(item => item.id)
      );


    }


  };





  // =============================
  // تحديد مخالفة
  // =============================

  const toggleSelect = (id) => {


    setSelectedIds(prev => {


      if(prev.includes(id)){


        return prev.filter(
          x => x !== id
        );


      }


      return [
        ...prev,
        id
      ];


    });


  };





  // =============================
  // Excel
  // =============================

  const exportExcel = () => {


    const rows = failures

    .filter(item =>
      selectedIds.includes(item.id)
    )

    .map(item => ({


      "رقم المخالفة":
      item.id,


      "اسم المنطقة":
      item.district,


      "اسم الحي":
      item.block


    }));




    const worksheet =
      XLSX.utils.json_to_sheet(rows);




    const workbook =
      XLSX.utils.book_new();




    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      "المخالفات المسددة"

    );




    XLSX.writeFile(

      workbook,

      "المخالفات_المسددة.xlsx"

    );


  };







  // =============================
  // تنفيذ التسديد
  // =============================

  async function validateFailures(){


    if(code !== "271998"){


      alert("الكود غير صحيح");


      return;


    }





    if(selectedIds.length === 0){


      alert("لم يتم تحديد مخالفات");


      return;


    }



    try{


      setLoading(true);



      let success = 0;



      for(const id of selectedIds){



        const response = await fetch(

          `/api/validate-failure/${id}`,

          {


            method:"POST",


            headers:{


              "Content-Type":
              "application/json"


            },


            body:JSON.stringify({

              accepted:true

            })


          }


        );




        if(response.ok){

          success++;

        }


      }






      alert(

        `تم تسديد ${success} من ${selectedIds.length} مخالفة`

      );





      if(success > 0){


        exportExcel();


      }





      setSelectedIds([]);

      setCode("");

      setConfirmOpened(false);

      onClose();



    }

    catch(error){


      console.log(error);


      alert(

        "حدث خطأ أثناء التسديد"

      );


    }

    finally{


      setLoading(false);


    }


  }







  return (

    <>


      {/* ===========================
          قائمة المخالفات
      ============================ */}


      <Modal

        opened={opened}

        onClose={onClose}

        title={title}

        centered

        size="lg"

        dir="rtl"

      >


        <Stack gap="md">



          <Group justify="space-between">


            <Text fw={800}>


              عدد المخالفات:
              {" "}
              {failures.length}


            </Text>



           {
allowPayment && (

<Button

  size="xs"

  variant="light"

  onClick={selectAll}

>

{

selectedIds.length === failures.length

?

"إلغاء الكل"

:

"تحديد الكل"

}

</Button>

)
}



          </Group>





          <Divider />





          <Stack>



            {

failures.map((item,index) => (

<Card

  key={`${item.id}-${index}`}

  withBorder

  radius="md"

  p="sm"

>



                <Group

                  justify="space-between"

                >

{
allowPayment && (

<Checkbox

  checked={
    selectedIds.includes(item.id)
  }

  onChange={() =>
    toggleSelect(item.id)
  }

/>

)
}





                  <Stack

                    gap={3}

                    align="flex-end"

                  >



                    <Badge

                      size="lg"

                      color="blue"

                      variant="light"

                    >

                      {item.id}

                    </Badge>




                    <Text

                      size="xs"

                      c="dimmed"

                      fw={700}

                    >

                      {item.district}

                      {" - "}

                      {item.block}


                    </Text>



                  </Stack>



                </Group>



              </Card>



            ))

            }



          </Stack>



{
allowPayment && (


          <Button


            color="green"

            radius="xl"

            disabled={
              selectedIds.length === 0
            }


            onClick={() =>
              setConfirmOpened(true)
            }


          >

            تسديد المحدد

            {" "}

            ({selectedIds.length})


          </Button>


)}


        </Stack>



      </Modal>







      {/* ===========================
          تأكيد الكود
      ============================ */}



      <Modal

        opened={confirmOpened}

        onClose={() =>
          setConfirmOpened(false)
        }

        centered

        title="تأكيد التسديد"

        dir="rtl"

      >



        <Stack gap="md">



          <Text fw={700}>


            سيتم تسديد

            {" "}

            {selectedIds.length}

            {" "}

            مخالفة


          </Text>




          <PasswordInput


            label="كود التأكيد"


            placeholder="ادخل الكود"


            value={code}


            onChange={(e)=>
              setCode(e.target.value)
            }


          />





          <Button


            color="green"


            loading={loading}


            radius="xl"


            onClick={validateFailures}


          >


            تأكيد التسديد


          </Button>




        </Stack>



      </Modal>



    </>


  );


}