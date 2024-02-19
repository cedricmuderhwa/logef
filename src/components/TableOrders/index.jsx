import React, { useState } from 'react';
import {
  createStyles,
  Table,
  ScrollArea,
  UnstyledButton,
  Group,
  Text,
  Center,
  TextInput,
  ActionIcon,
  Badge,
} from '@mantine/core';
import { BsChevronExpand, BsChevronUp, BsChevronDown, BsSearch, BsTrash, BsPencilSquare } from 'react-icons/bs'

const data = [
  {
      "date": "2021/12/21 - 15:30",
      "description": "Shooting en famille de Mr Matata",
      "category": "Studio Photoshoot",
      "amount": "$25.00",
      "status": "pending",
      "package": "10 photos",
      "bonus" : 2
  },
  {
      "date": "2022/01/11 - 09:25",
      "description": "Anniversaire de mariage Binja Jemima",
      "category": "Private Photoshoot",
      "amount": "$50.00",
      "status": "done",
      "package": "58 photos",
      "bonus" : 5
  },
  {
      "date": "2022/01/28 - 11:30",
      "description": "Collation de license academique",
      "category": "Studio Photoshoot",
      "amount": "13,000.00 CDF",
      "status": "done",
      "package": "24 photos",
      "bonus": null
  },
  {
      "date": "2022/03/20 - 16:30",
      "description": "Mariage Civil Jean Bernard",
      "category": "Wedding Photoshoot",
      "amount": "$50.00",
      "status": "In progress",
      "package": "Platinum",
      "bonus" : null
  }
]

const useStyles = createStyles((theme) => ({
  th: {
    padding: '0 !important',
  },

  control: {
    width: '100%',
    padding: `${theme.spacing.xs}px ${theme.spacing.md}px`,

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
  },

  icon: {
    width: 21,
    height: 21,
    borderRadius: 21,
  },
}));

function Th({ children, reversed, sorted, onSort }) {
  const { classes } = useStyles();
  const Icon = sorted ? (reversed ? BsChevronUp : BsChevronDown) : BsChevronExpand;
  return (
    <th className={classes.th}>
      <UnstyledButton onClick={onSort} className={classes.control}>
        <Group position="apart">
          <Text weight={500} size="sm">
            {children}
          </Text>
          <Center className={classes.icon}>
            {children === 'Prix Unitaire' || children === 'Prix Total' || children === 'Actions' || children === 'Quantité' ? null : <Icon size={14} /> }
          </Center>
        </Group>
      </UnstyledButton>
    </th>
  );
}

function filterData(data, search) {
  const keys = Object.keys(data[0]);
  const query = search.toLowerCase().trim();
  return data.filter((item) => keys.some((key) => item[key].toLowerCase().includes(query)));
}

function sortData(data, payload) {
  if (!payload.sortBy) {
    return filterData(data, payload.search);
  }

  return filterData(
    [...data].sort((a, b) => {
      if (payload.reversed) {
        return b[payload.sortBy].localeCompare(a[payload.sortBy]);
      }

      return a[payload.sortBy].localeCompare(b[payload.sortBy]);
    }),
    payload.search
  );
}

export default function TableOrders() {
  const [search, setSearch] = useState('');
  const [sortedData, setSortedData] = useState(data);
  const [sortBy, setSortBy] = useState(null);
  const [reverseSortDirection, setReverseSortDirection] = useState(false);

  const setSorting = (field) => {
    const reversed = field === sortBy ? !reverseSortDirection : false;
    setReverseSortDirection(reversed);
    setSortBy(field);
    setSortedData(sortData(data, { sortBy: field, reversed, search }));
  };

  const handleSearchChange = (event) => {
    const { value } = event.currentTarget;
    setSearch(value);
    setSortedData(sortData(data, { sortBy, reversed: reverseSortDirection, search: value }));
  };

  const roundToTwo = (num) => {
    return +(Math.round(num + "e+2"))
  }

  const rows = sortedData.map((row) => (
    <tr key={row.date}>
      <td>{row.date}</td>
      <td style={{textOverflow: 'ellipsis', color: 'GrayText'}}>{row.description}</td>
      <td style={{textAlign: 'right', fontFamily: 'Menlo'}}>{`${row.qty} pcs`}</td>
      <td style={{textAlign: 'right', fontFamily: 'Menlo'}}>{`USD ${row.unit_cost.toFixed(2)}`}</td>
      <td style={{textAlign: 'right', fontFamily: 'Menlo', color: 'dodgerblue'}}>{`USD ${row.total_cost.toFixed(2)}`}</td>
      <td>
        <Badge color="gray" radius="sm" >{row.status}</Badge>
      </td>
      <td style={{ width: '100%', display: 'inline-flex', alignItems: 'center' }}>
        <ActionIcon color="blue" variant="light" style={{marginRight: 14}}><BsPencilSquare size={16} /></ActionIcon>
        <ActionIcon color="green" variant="light" style={{marginRight: 14}}><BsPencilSquare size={16} /></ActionIcon>
        <ActionIcon color="red" variant="light"><BsTrash size={16} /></ActionIcon>
      </td>
    </tr>
  ));

  return (
    <ScrollArea>
      <TextInput
        placeholder="Search by any field"
        variant="filled" 
        mb="md"
        icon={<BsSearch size={14} />}
        value={search}
        onChange={handleSearchChange}
      />
      <Table
        highlightOnHover
        horizontalSpacing="md"
        verticalSpacing="xs"
        sx={{ tableLayout: 'fixed', minWidth: 700 }}
      >
        <colgroup>
        </colgroup>
        <thead>
          <tr>
            <Th
              sorted={sortBy === 'date'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('date')}
            >
              Date
            </Th>
            <Th
              sorted={sortBy === 'description'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('description')}
            >
              Denomination
            </Th>
            <Th
              style={{textAlign: 'right'}}
            >
              Quantité
            </Th>
            <Th
              style={{textAlign: 'right'}}
            >
              Prix Unitaire
            </Th>
            <Th
              style={{textAlign: 'right'}}
            >
              Prix Total
            </Th>
            <Th
              sorted={sortBy === 'status'}
              reversed={reverseSortDirection}
              onSort={() => setSorting('status')}
            >
              Status
            </Th>
            <Th>
              Actions
            </Th>
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows
          ) : (
            <tr>
              <td colSpan={Object.keys(data[0]).length + 1}>
                <Text weight={500} align="center">
                  Nothing found
                </Text>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </ScrollArea>
  );
}