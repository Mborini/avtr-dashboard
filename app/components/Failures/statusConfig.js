import {
  IconCircleCheck,
  IconX,
  IconClock,
} from "@tabler/icons-react";

export const summaryOnlyStatuses = [
  "ResolutionRejected",
  "PendingSpValidation",
];


export const statusConfig = {
 PendingSpValidation:{
    label:"بانتظار القبول",
    color:"gray",
    bg:"#f1f3f5",
    icon:<IconClock size={18}/>
  },
  InProgress:{
    label:"قيد التنفيذ",
    color:"orange",
    bg:"#fff4e0",
    icon:<IconClock size={18}/>
  },
  PendingFieldMonitorVerification:{
    label:"في انتظار التحقق الميداني",
    color:"cyan",
    bg:"#e7f5ff",
    icon:<IconClock size={18}/>
  },

  Resolved:{
    label:"تم الحل",
    color:"green",
    bg:"#e9f8ee",
    icon:<IconCircleCheck size={18}/>
  },


 
  PendingSupervisorReview:{
    label:"قيد مراجعة AVTR",
    color:"violet",
    bg:"#f3f0ff",
    icon:<IconClock size={18}/>
  },
 
  Rejected:{
    label:"AVTR قبلت الرفض",
    color:"red",
    bg:"#ffeaea",
    icon:<IconClock size={18}/>
  },
 ResolutionRejected:{
    label:"AVTR رفضت الحل",
    color:"red",
    bg:"#ffeaea",
    icon:<IconX size={18}/>
  },






  

};