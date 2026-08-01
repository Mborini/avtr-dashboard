import { NextResponse } from "next/server";


export async function GET(request) {
  
  try {
    
    
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6ImMyZmI4NGI3LTAzNGMtNDY2Ny04YzM0LTk2NjIyMzZhOWI0MSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6Ik1vaGFtbWFkLkJvcmluaUBlZnNtZS5jb20iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiTW9oYW1tYWQgIEJvcmluaSIsIlVzZXJUeXBlIjoiU2VydmljZVByb3ZpZGVyIiwiUm9sZUlkIjoiNDUiLCJSb2xlTmFtZSI6IlN1cGVydmlzb3IiLCJTZXJ2aWNlUHJvdmlkZXJJZCI6IjMiLCJTZXJ2aWNlUHJvdmlkZXJOYW1lIjoiRUZTIiwiUHJpdmlsZWdlIjpbIlZpZXdVc2VycyIsIlZpZXdGYWlsdXJlcyIsIkVkaXRGYWlsdXJlcyIsIlZpZXdLUElzIiwiVmlld1JvbGVzIiwiVmlld1pvbmVzIiwiVmlld0NvbXBsYWludHMiLCJNYW5hZ2VGaWVsZEVtcGxveWVlRGlzdHJpY3RzIl0sImV4cCI6MTc4NzcyODYyMywiaXNzIjoiUW1zSXNzdWVyIiwiYXVkIjoiUW1zQXVkaWVuY2UifQ.pXSnU9lfWQzIuMjcDEPvOsGyhLFc9yW7tyJt9WXWtZo";


    const { searchParams } = new URL(request.url);



    const districtNames =
      searchParams.get("districtNames") || "";
const now = new Date();

const year = now.getFullYear();
const month = now.getMonth() + 1;
const day = now.getDate();


const dateFrom =
  searchParams.get("dateFrom") ||
  `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}T21:00:00.000Z`;


const dateTo =
  searchParams.get("dateTo") ||
  `${year}-${String(month).padStart(2,"0")}-${String(day).padStart(2,"0")}T20:59:59.999Z`;
    const sortBy =
      searchParams.get("sortBy") ||
      "reportedDate";



    const sortDirection =
      searchParams.get("sortDirection") ||
      "desc";





    // ==========================
    // جلب كل المخالفات Pagination
    // ==========================


    const pageSize = 100;


    let allFailures = [];

    let offset = 0;

    let total = 0;



    do {


      const response = await fetch(

        `https://api.avtr.jo/api/service-provider/failures?` +
        `limit=${pageSize}` +
        `&offset=${offset}` +
        `&districtNames=${encodeURIComponent(districtNames)}` +
        `&dateFrom=${encodeURIComponent(dateFrom)}` +
        `&dateTo=${encodeURIComponent(dateTo)}` +
        `&sortBy=${sortBy}` +
        `&sortDirection=${sortDirection}`,

        {
          headers:{
            Authorization:`Bearer ${token}`,
            Accept:"application/json"
          },

          cache:"no-store"
        }

      );



      if(!response.ok){

        throw new Error(
          `Failures API Error: ${response.status}`
        );

      }



      const result =
        await response.json();



      total =
        result.total || 0;



      allFailures.push(
        ...(result.items || [])
      );



      offset += pageSize;



    }
    while(
      allFailures.length < total
    );







    // ==========================
    // جلب تفاصيل كل مخالفة
    // ==========================


const items = await Promise.all(

  allFailures.map(async(item)=>{

    const detailsResponse = await fetch(
      `https://api.avtr.jo/api/service-provider/failures/${item.id}`,
      {
        headers:{
          Authorization:`Bearer ${token}`,
          Accept:"application/json"
        },
        cache:"no-store"
      }
    );


    const details = await detailsResponse.json();

const lastActivity =
  details.activities?.at(-1);


return {

  id:item.id,

  districtName:item.districtName,

  blockName:item.blockName,

  status:item.status,

  kpiNameAr: details.kpiNameAr,
  userName:
    lastActivity?.userName || "غير معروف",


  activities:
    details.activities || []

};

  })

);






return NextResponse.json({
  total: items.length,
  items
});






  }
  catch(error){


    console.error(error);



    return NextResponse.json(

      {
        error:error.message
      },

      {
        status:500
      }

    );


  }


}