import {
  IconCircleCheck,
  IconX,
  IconClock,
} from "@tabler/icons-react";


export const summaryOnlyStatuses = [
  "Resolved",
  "ResolutionRejected",
  "PendingSpValidation",
];



export const statusConfig = {

  Resolved:{
    label:"تم الحل",
    color:"green",
    bg:"#e9f8ee",
    icon:<IconCircleCheck size={18}/>
  },


  ResolutionRejected:{
    label:"رفض الحل",
    color:"red",
    bg:"#ffeaea",
    icon:<IconX size={18}/>
  },


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


  PendingSupervisorReview:{
    label:"قيد مراجعة AVTR",
    color:"violet",
    bg:"#f3f0ff",
    icon:<IconClock size={18}/>
  },

};