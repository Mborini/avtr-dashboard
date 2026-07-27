"use client";

import {
  Table,
  Badge,
  Text,
  ActionIcon,
} from "@mantine/core";

import { IconEye } from "@tabler/icons-react";

export default function FailureTable({
  items,
  statusColors,
  statusName,
  onOpenActivities,
}) {
  return (
    <Table striped highlightOnHover withTableBorder>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>ID</Table.Th>
          <Table.Th>District</Table.Th>
          <Table.Th>Block</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>KPI</Table.Th>
          <Table.Th>Latitude</Table.Th>
          <Table.Th>Longitude</Table.Th>
          <Table.Th>Reported On</Table.Th>
          <Table.Th>Deadline</Table.Th>
          <Table.Th>Activities</Table.Th>
        </Table.Tr>
      </Table.Thead>

      <Table.Tbody>
        {items.map((item) => (
          <Table.Tr key={item.id}>
            <Table.Td>{item.id}</Table.Td>

            <Table.Td>{item.districtName}</Table.Td>

            <Table.Td>{item.blockName}</Table.Td>

            <Table.Td>
              <Badge
                size="md"
                color={statusColors[item.status] || "gray"}
              >
                {statusName[item.status] || item.status}
              </Badge>
            </Table.Td>

            <Table.Td>{item.kpiNameAr}</Table.Td>

            <Table.Td>{item.latitude}</Table.Td>

            <Table.Td>{item.longitude}</Table.Td>

            <Table.Td>
              {item.reportedOn
                ? new Date(item.reportedOn).toLocaleString("ar-JO")
                : "-"}
            </Table.Td>

            <Table.Td>
              {item.deadline
                ? new Date(item.deadline).toLocaleString("ar-JO")
                : "-"}
            </Table.Td>

            <Table.Td>
              <ActionIcon
                variant="light"
                color="blue"
                onClick={() => onOpenActivities(item.activities)}
              >
                <IconEye size={18} />
              </ActionIcon>
            </Table.Td>
          </Table.Tr>
        ))}

        {items.length === 0 && (
          <Table.Tr>
            <Table.Td colSpan={10}>
              <Text ta="center">No results found</Text>
            </Table.Td>
          </Table.Tr>
        )}
      </Table.Tbody>
    </Table>
  );
}