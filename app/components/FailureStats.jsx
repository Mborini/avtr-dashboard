"use client";

import {
  Card,
  Text,
  Group,
  Badge,
  Stack,
  Divider,
  ThemeIcon,
  SimpleGrid,
  Avatar,
  Box,
} from "@mantine/core";

import {
  IconMapPin,
  IconAlertTriangle,
  IconUser,
  IconCircleCheck,
  IconClock,
  IconX,
} from "@tabler/icons-react";

export default function FailureStats({ items = [] }) {
  const summaryOnlyStatuses = [
    "Resolved",
    "ResolutionRejected",
    "PendingSpValidation",
  ];

const statusConfig = {
  Resolved: {
    label: "تم الحل",
    color: "green",
    bg: "#e9f8ee",
    icon: <IconCircleCheck size={18} />,
  },

  ResolutionRejected: {
    label: "رفض الحل",
    color: "red",
    bg: "#ffeaea",
    icon: <IconX size={18} />,
  },

  PendingSpValidation: {
    label: "بانتظار القبول",
    color: "gray",
    bg: "#f1f3f5",
    icon: <IconClock size={18} />,
  },

  InProgress: {
    label: "قيد التنفيذ",
    color: "orange",
    bg: "#fff4e0",
    icon: <IconClock size={18} />,
  },

  PendingFieldMonitorVerification: {
    label: "في انتظار التحقق الميداني",
    color: "cyan",
    bg: "#e7f5ff",
    icon: <IconClock size={18} />,
  },

  PendingSupervisorReview: {
    label: "قيد مراجعة AVTR",
    color: "violet",
    bg: "#f3f0ff",
    icon: <IconClock size={18} />,
  },
};

  const stats = {};

  items.forEach((item) => {
    const district = item.districtName || "غير معروف";
    const block = item.blockName || "غير معروف";
    const status = item.status || "Unknown";

    let lastUser = null;

    if (
      !summaryOnlyStatuses.includes(status) &&
      item.activities?.length
    ) {
      lastUser =
        item.activities[item.activities.length - 1]?.userName ||
        "Unknown";
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

    stats[district].blocks[block].total++;

    if (!stats[district].blocks[block].statuses[status]) {
      stats[district].blocks[block].statuses[status] = {
        total: 0,
        users: {},
      };
    }

    stats[district].blocks[block].statuses[status].total++;

    if (lastUser) {
      stats[district].blocks[block].statuses[status].users[lastUser] =
        (stats[district].blocks[block].statuses[status].users[lastUser] || 0) +
        1;
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
    <Stack gap="md">

      {/* Header Card */}
      <Card
        radius="xl"
        p="md"
        shadow="sm"
        style={{
          background:
            "linear-gradient(135deg,#ff6b6b 0%, #ff8787 100%)",
          color: "white",
        }}
      >
        <Group justify="space-between">
          <div>
            <Text size="xs" opacity={0.85}>
              إجمالي المخالفات
            </Text>

            <Text
              fw={900}
              size="42px"
              lh={1}
            >
              {items.length}
            </Text>
          </div>

          <ThemeIcon
            radius="xl"
            size={60}
            variant="white"
            color="rgba(255,255,255,.15)"
          >
            <IconAlertTriangle size={30} />
          </ThemeIcon>

        </Group>
      </Card>


      {Object.entries(stats).map(([district, data]) => (

        <Card
          key={district}
          radius="xl"
          p="md"
          shadow="xs"
          style={{
            background: "#fff",
            border: "1px solid #edf2f7",
          }}
        >

          <Group justify="space-between">

            <Group gap="sm">

              <ThemeIcon
                size={42}
                radius="xl"
                variant="gradient"
                gradient={{
                  from: "blue",
                  to: "cyan",
                  deg: 135,
                }}
              >
                <IconMapPin size={20}/>
              </ThemeIcon>


              <div>

                <Text
                  fw={800}
                  size="md"
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


            <Badge
              size="lg"
              radius="xl"
              variant="light"
              color="blue"
            >
              {data.total}
            </Badge>


          </Group>


          <Divider my="sm"/>


          <SimpleGrid
            cols={{
              base:1,
              sm:2,
              md:3,
            }}
            spacing="sm"
          >


            {Object.entries(data.blocks).map(
              ([block, blockData]) => (

              <Card
                key={block}
                radius="lg"
                p="sm"
                shadow="xs"
                style={{
                  background:"#fafafa",
                  border:"1px solid #f1f3f5",
                }}
              >


                <Group
                  justify="space-between"
                  mb="xs"
                >

                  <Text
                    fw={700}
                    size="sm"
                  >
                    📍 {block}
                  </Text>


                  <Badge
                    size="sm"
                    radius="xl"
                    variant="light"
                  >
                    {blockData.total}
                  </Badge>

                </Group>



                <Stack gap="xs">


                {Object.entries(blockData.statuses)
                .map(([status,statusData]) => (

                  <Card
                    key={status}
                    radius="md"
                    p="xs"
                    style={{
                      background:
                      statusConfig[status]?.bg ||
                      "#f8f9fa",
                      border:"none",
                    }}
                  >

                    <Group
                      justify="space-between"
                    >

                      <Group gap={6}>

                        {
                          statusConfig[status]?.icon
                        }


                        <Text
                          fw={600}
                          size="sm"
                        >
                          {
                            statusConfig[status]?.label ||
                            status
                          }
                        </Text>


                      </Group>



                      <Badge
                        size="sm"
                        radius="xl"
                        color={
                          statusConfig[status]?.color ||
                          "gray"
                        }
                        variant="light"
                      >
                        {statusData.total}
                      </Badge>


                    </Group>



                    {!summaryOnlyStatuses.includes(status) && (

                      <Stack
                        mt="xs"
                        gap={6}
                      >

                      {
                      Object.entries(statusData.users)
                      .map(([user,count]) => (

                        <Group
                          key={user}
                          justify="space-between"
                          p={6}
                          style={{
                            background:
                            "rgba(255,255,255,.7)",
                            borderRadius:8,
                          }}
                        >

                          <Group gap="xs">

                            <Avatar
                              size="sm"
                              radius="xl"
                              color="blue"
                              variant="light"
                            >
                              {user.charAt(0)}
                            </Avatar>


                            <Text size="xs">
                              {user}
                            </Text>

                          </Group>



                          <Badge
                            size="sm"
                            radius="xl"
                            variant="outline"
                          >
                            {count}
                          </Badge>


                        </Group>

                      ))
                      }


                      </Stack>

                    )}


                  </Card>

                ))}


                </Stack>


              </Card>

            ))}


          </SimpleGrid>


        </Card>

      ))}


    </Stack>
  </Box>
);
}