import React from "react";
import {
  Box,
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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  IconButton,
} from "@chakra-ui/react";
import { FiEdit } from "react-icons/fi";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/auth";
import { useEffect, useState } from "react";
import { getOrder, change_item_state } from "../endpoints/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useItemsContext } from "../context/itemsContext";
const AdminItems = () => {
  const {
    logoutUser,
    refresh,
    navigatingToLogin,
    withErrorHandler,
    withRefresh,
  } = useAuth();
  const { items, setItems, loadItems } = useItemsContext();
  const [headphoneCount, setHeadphoneCount] = useState(0);

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
  const {
    isOpen: isOrderModalOpen,
    onOpen: onOrderModalOpen,
    onClose: onOrderModalClose,
  } = useDisclosure();
  const [selectedOrderInfo, setSelectedOrderInfo] = useState(null);
  const [orderModalLoading, setOrderModalLoading] = useState(false);
  const [orderModalError, setOrderModalError] = useState(null);

  const handleOpenOrderModal = async (orderId) => {
    setOrderModalLoading(true);
    setOrderModalError(null);
    try {
      const data = await getOrder(orderId); // <- your API call
      setSelectedOrderInfo(data);
      onOrderModalOpen();
    } catch (e) {
      setOrderModalError(e?.message || "Failed to load order");
      onOrderModalOpen(); // optionally still open to show the error
    } finally {
      setOrderModalLoading(false);
    }
  };

  const openModal = (item, targetState) => {
    setModalData({ item, targetState });
    onOpen();
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
        toast.success("Pomyślnie zmieniono status słuchawek");
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
  const updateHeadphoneCount = (items) => {
    const count = items.filter((item) => item.state === "wydane").length;
    setHeadphoneCount(count);
  };
  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      await loadItems();
      setLoading(false);
    };

    withErrorHandler(fetchItems, () => {
      setItems([]);
      setFilteredItems([]);
      setSelectedStatuses({});
      setLoading(false);
    });
  }, []);
  useEffect(() => {
    setFilteredItems(items);
    const initialStatuses = items.reduce(
      (acc, order) => ({
        ...acc,
        [order.id]: order.state,
      }),
      {}
    );
    setSelectedStatuses(initialStatuses);
    updateHeadphoneCount(items);
  }, [items]);
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
      <Box mt={4} mb={4}>
        <strong>Aktualnie wypożyczone słuchawki:</strong> {headphoneCount}
      </Box>
      <Box mt={4} mb={4}>
        <strong>Liczba wszystkich słuchawek:</strong> {items.length}
      </Box>
      <Box mt={8}>
        {loading ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minH="200px"
          >
            <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
          </Box>
        ) : (
          <TableContainer overflowX="auto" maxW="100%" withSpace="nowrap">
            <Table variant="striped" colorScheme="blue">
              <Thead>
                <Tr>
                  <Th>Token</Th>
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
                    <Input
                      size="sm"
                      onChange={(e) =>
                        handleFilterChange("token", e.target.value)
                      }
                    />
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
                      variant="filled"
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
                    <Tr key={order.token}>
                      <Td>{order.token}</Td>
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
                      <Td>
                        <Button
                          variant="link"
                          colorScheme="blue"
                          onClick={() => {
                            handleOpenOrderModal(order.order);
                          }}
                        >
                          {order.order}
                        </Button>
                      </Td>
                      <Td>
                        {currentState ===
                        "zarezerwowane" ? null : currentState === "wydane" ? ( // </Button> //   Wydaj // > //   onClick={() => handleStatusChange(order, "wydane")} //   colorScheme="blue" //   size="sm" // <Button
                          <Button
                            size="sm"
                            leftIcon={<FiEdit />}
                            colorScheme="blue"
                            aria-label="Zmień status"
                            isDisabled={selected === currentState}
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
                  <Badge
                    colorScheme={getColor(modalData.targetState)}
                    variant="subtle"
                  >
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
      <Modal isOpen={isOrderModalOpen} onClose={onOrderModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Szczegóły zamówienia</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedOrderInfo && (
              <>
                <Text>
                  <strong>ID zamówienia:</strong> {selectedOrderInfo.id}
                </Text>
                <Text mt={2}>
                  <strong>Kod zamówienia:</strong>{" "}
                  {selectedOrderInfo.order_code}
                </Text>
                <Text mt={2}>
                  <strong>Imię:</strong> {selectedOrderInfo.account?.first_name}
                </Text>
                <Text mt={2}>
                  <strong>Nazwisko:</strong>{" "}
                  {selectedOrderInfo.account?.last_name}
                </Text>
                <Text mt={2}>
                  <strong>Email:</strong> {selectedOrderInfo.account?.email}
                </Text>
                <Text mt={2}>
                  <strong>Telefon:</strong>{" "}
                  {selectedOrderInfo.account?.phone_number}
                </Text>
                <Text mt={2}>
                  <strong>Liczba przedmiotów:</strong>{" "}
                  {selectedOrderInfo.items_count}
                </Text>
                <Text mt={2}>
                  <strong>Status:</strong>{" "}
                  <Badge colorScheme={getColor(selectedOrderInfo.state)}>
                    {selectedOrderInfo.state}
                  </Badge>
                </Text>
                <Text mt={2}>
                  <strong>Data utworzenia:</strong>{" "}
                  {new Date(selectedOrderInfo.creation_date).toLocaleString()}
                </Text>
                <Text mt={2}>
                  <strong>Data modyfikacji:</strong>{" "}
                  {new Date(
                    selectedOrderInfo.modification_date
                  ).toLocaleString()}
                </Text>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onOrderModalClose}>Zamknij</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default AdminItems;
