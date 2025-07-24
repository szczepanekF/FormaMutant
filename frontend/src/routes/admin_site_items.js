import React from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Button,
  Spinner,
  Th,
  Td,
  TableContainer,
  Input,
  Select,
  Badge,
} from "@chakra-ui/react";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
} from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/auth";
import { useEffect, useState } from "react";
import { getAllItems, change_item_state } from "../endpoints/api";
import { useNavigate } from "react-router-dom";

const AdminItems = () => {
  const { logoutUser, refresh, navigatingToLogin, withErrorHandler, withRefresh } =
    useAuth();
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalData, setModalData] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const nav = useNavigate();

  const openModal = (item, targetState) => {
    setModalData({ item, targetState });
    onOpen();
  };
  const handleLogout = async () => {
    await logoutUser();
  };

  const getColor = (state) => {
    switch (state) {
      case "zarezerwowane":
        return "yellow";
      case "wydane":
        return "blue";
      case "zwrócone":
        return "green";
      case "zgubione":
        return "red";
      case "uszkodzone":
        return "orange";
      default:
        return "gray";
    }
  };

  // const handleStatusChange = async (order, newStatus) => {
  //   await change_item_state(newStatus, order.token);
  //   selectedItem.state = newStatus;
  //   setItems((prev) =>
  //     prev.map((item) =>
  //       item.id === modalData.item.id
  //         ? { ...item, state: modalData.targetState }
  //         : item
  //     )
  //   );
  //   setSelectedItem(null);
  // };

  const handleStatusChange = async (order, newStatus) => {
    await withRefresh(
      async () => {
        await change_item_state(newStatus, order.token);
        selectedItem.state = newStatus;
        setItems((prev) =>
          prev.map((item) =>
            item.id === modalData.item.id
              ? { ...item, state: modalData.targetState }
              : item
          )
        );
        setSelectedItem(null);
      },
      () => {
        console.log("error");
      }
    );
  };



  const handleSelectChange = (orderId, value) => {
    setSelectedStatuses((prev) => ({
      ...prev,
      [orderId]: value,
    }));
  };

  useEffect(() => {
    const fetchItems = async () => {
      console.log('items');
      setLoading(true);
      const items = await getAllItems();
      setItems(items);
      setFilteredItems(items);

      const initialStatuses = items.reduce(
        (acc, order) => ({
          ...acc,
          [order.id]: order.state,
        }),
        {}
      );
      setSelectedStatuses(initialStatuses);
      setLoading(false);
    };

    withErrorHandler(fetchItems, () => {
      setItems([]);
      setFilteredItems([]);
      setSelectedStatuses({});
      setLoading(false);
    });
  }, []);

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value.toLowerCase() };
    setFilters(newFilters);

    const filtered = items.filter((order) => {
      return Object.entries(newFilters).every(([key, val]) => {
        const target = key.includes("item.")
          ? order.account[key.split(".")[1]]
          : order[key];

        return String(target).toLowerCase().includes(val);
      });
    });

    setFilteredItems(filtered);
  };

  const handleSort = (field, direction) => {
    const sorted = [...filteredItems].sort((a, b) => {
      const aVal = field.includes("item.")
        ? a.account[field.split(".")[1]]
        : a[field];
      const bVal = field.includes("item.")
        ? b.account[field.split(".")[1]]
        : b[field];
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortField(field);
    setSortDirection(direction);
    setFilteredItems(sorted);
  };

  return (
    <Box p={4}>
      <Box mt={8}>
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <TableContainer>
            <Table variant="striped" colorScheme="blue">
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>
                    Imię
                    <IconButton
                      aria-label="Sort ascending"
                      icon={<TriangleUpIcon />}
                      size="xs"
                      ml={2}
                      onClick={() => handleSort("first_name", "asc")}
                      isActive={
                        sortField === "first_name" && sortDirection === "asc"
                      }
                    />
                    <IconButton
                      aria-label="Sort descending"
                      icon={<TriangleDownIcon />}
                      size="xs"
                      ml={1}
                      onClick={() => handleSort("first_name", "desc")}
                      isActive={
                        sortField === "first_name" && sortDirection === "desc"
                      }
                    />
                  </Th>
                  <Th>
                    Nazwisko
                    <IconButton
                      aria-label="Sort ascending"
                      icon={<TriangleUpIcon />}
                      size="xs"
                      ml={2}
                      onClick={() => handleSort("last_name", "asc")}
                      isActive={
                        sortField === "last_name" && sortDirection === "asc"
                      }
                    />
                    <IconButton
                      aria-label="Sort descending"
                      icon={<TriangleDownIcon />}
                      size="xs"
                      ml={1}
                      onClick={() => handleSort("last_name", "desc")}
                      isActive={
                        sortField === "last_name" && sortDirection === "desc"
                      }
                    />
                  </Th>
                  <Th>
                    Status
                    <IconButton
                      aria-label="Sort ascending"
                      icon={<TriangleUpIcon />}
                      size="xs"
                      ml={2}
                      onClick={() => handleSort("state", "asc")}
                      isActive={
                        sortField === "state" && sortDirection === "asc"
                      }
                    />
                    <IconButton
                      aria-label="Sort descending"
                      icon={<TriangleDownIcon />}
                      size="xs"
                      ml={1}
                      onClick={() => handleSort("state", "desc")}
                      isActive={
                        sortField === "state" && sortDirection === "desc"
                      }
                    />
                  </Th>
                  <Th>
                    Numer
                    <IconButton
                      aria-label="Sort ascending"
                      icon={<TriangleUpIcon />}
                      size="xs"
                      ml={2}
                      onClick={() => handleSort("item_real_ID", "asc")}
                      isActive={
                        sortField === "item_real_ID" && sortDirection === "asc"
                      }
                    />
                    <IconButton
                      aria-label="Sort descending"
                      icon={<TriangleDownIcon />}
                      size="xs"
                      ml={1}
                      onClick={() => handleSort("item_real_ID", "desc")}
                      isActive={
                        sortField === "item_real_ID" && sortDirection === "desc"
                      }
                    />
                  </Th>
                  <Th>
                    Numer zamówienia
                    <IconButton
                      aria-label="Sort ascending"
                      icon={<TriangleUpIcon />}
                      size="xs"
                      ml={2}
                      onClick={() => handleSort("order", "asc")}
                      isActive={
                        sortField === "order" && sortDirection === "asc"
                      }
                    />
                    <IconButton
                      aria-label="Sort descending"
                      icon={<TriangleDownIcon />}
                      size="xs"
                      ml={1}
                      onClick={() => handleSort("order", "desc")}
                      isActive={
                        sortField === "order" && sortDirection === "desc"
                      }
                    />
                  </Th>
                  <Th>Akcje</Th>
                </Tr>
                <Tr>
                  <Th>
                    {/* <Input
                      size="sm"
                      onChange={(e) => handleFilterChange("id", e.target.value)}
                    /> */}
                  </Th>
                  <Th>
                    <Input
                      size="sm"
                      onChange={(e) =>
                        handleFilterChange("first_name", e.target.value)
                      }
                    />
                  </Th>
                  <Th>
                    <Input
                      size="sm"
                      onChange={(e) =>
                        handleFilterChange("last_name", e.target.value)
                      }
                    />
                  </Th>
                  <Th>
                    <Select
                      size="sm"
                      placeholder="Wszystkie"
                      onChange={(e) =>
                        handleFilterChange("state", e.target.value)
                      }
                    >
                      <option value="zarezerwowane">Zarezerwowane</option>
                      <option value="wydane">Wydane</option>
                      <option value="zwrócone">Zwrócone</option>
                      <option value="zgubione">Zgubione</option>
                      <option value="uszkodzone">Uszkodzone</option>
                    </Select>
                  </Th>
                  <Th>
                    <Input
                      size="sm"
                      onChange={(e) =>
                        handleFilterChange("item_real_ID", e.target.value)
                      }
                    />
                  </Th>
                  <Th>
                    <Input
                      size="sm"
                      onChange={(e) =>
                        handleFilterChange("order", e.target.value)
                      }
                    />
                  </Th>
                  <Th colSpan={2} />
                </Tr>
              </Thead>
              <Tbody>
                {filteredItems.map((order) => {
                  const currentState = order.state;
                  const selected = selectedStatuses[order.id] || currentState;

                  return (
                    <Tr key={order.id}>
                      <Td>{order.id}</Td>
                      <Td>{order.first_name}</Td>
                      <Td>{order.last_name}</Td>
                      <Td>
                        {currentState === "zarezerwowane" ? (
                          <Badge colorScheme={getColor(currentState)}>
                            Zarezerwowane
                          </Badge>
                        ) : currentState === "wydane" ? (
                          <Select
                            size="sm"
                            value={selected}
                            onChange={(e) =>
                              handleSelectChange(order.id, e.target.value)
                            }
                            borderColor={getColor(selected)}
                          >
                            <option value="wydane">Wydane</option>
                            <option value="zwrócone">Zwrócone</option>
                            <option value="zgubione">Zgubione</option>
                            <option value="uszkodzone">Uszkodzone</option>
                          </Select>
                        ) : (
                          <Badge colorScheme={getColor(currentState)}>
                            {currentState}
                          </Badge>
                        )}
                      </Td>
                      <Td>{order.item_real_ID}</Td>
                      <Td>{order.order}</Td>
                      <Td>
                        {currentState === "zarezerwowane" ? // </Button> //   Wydaj // > //   onClick={() => handleStatusChange(order, "wydane")} //   colorScheme="blue" //   size="sm" // <Button
                        null : currentState === "wydane" ? (
                          <Button
                            size="sm"
                            colorScheme="blue"
                            isDisabled={selected === currentState}
                            // onClick={() => handleStatusChange(order, selected)}
                            onClick={() => {
                              setSelectedItem(order);
                              openModal(order, selected);
                            }}
                          >
                            Zmień status
                          </Button>
                        ) : null}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Potwierdzenie zmiany statusu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalData && (
              <>
                <Text>
                  Czy na pewno chcesz zmienić status słuchawki{" "}
                  <b>#{modalData.item.item_real_ID}</b>?
                </Text>
                <Text mt={2}>
                  Klient:{" "}
                  <b>
                    {modalData.item.first_name} {modalData.item.last_name}
                  </b>
                </Text>
                <Text mt={2}>
                  Zamówienie: <b>#{modalData.item.order}</b>
                </Text>
                <Text mt={2}>
                  Nowy status:{" "}
                  <Badge colorScheme={getColor(modalData.targetState)}>
                    {modalData.targetState}
                  </Badge>
                </Text>
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Anuluj
            </Button>
            <Button
              colorScheme="blue"
              onClick={async () => {
                await handleStatusChange(modalData.item, modalData.targetState);
                onClose();
              }}
            >
              Potwierdź
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminItems;
