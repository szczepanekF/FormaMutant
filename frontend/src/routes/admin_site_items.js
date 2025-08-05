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
  SimpleGrid,
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
      <Box mt={4} mb={2}>
        <strong>Aktualnie wypożyczone słuchawki:</strong> {headphoneCount}
      </Box>
      <Box mt={4} mb={2}>
        <strong>Liczba wszystkich słuchawek:</strong> {items.length}
      </Box>
      <Box mt={2}>
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
            <Table variant="simple">
              <Thead>
                <Tr >
                  <Th color={"white"}>Token</Th>
                  <Th color={"white"}>
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
                  <Th color={"white"}>
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
                  <Th color={"white"}>
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
                  <Th color={"white"}>
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
                  <Th color={"white"}>
                    Zamówienie
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
                  <Th color={"white"}>Akcje</Th>
                </Tr>
                <Tr>
                  <Th>
                    <Input
                      size="sm"
                      color={"white"}
                      onChange={(e) =>
                        handleFilterChange("token", e.target.value)
                      }
                    />
                  </Th>
                  <Th>
                    <Input
                      size="sm"
                      color={"white"}
                      onChange={(e) =>
                        handleFilterChange("first_name", e.target.value)
                      }
                    />
                  </Th>
                  <Th>
                    <Input
                      size="sm"
                      color={"white"}
                      onChange={(e) =>
                        handleFilterChange("last_name", e.target.value)
                      }
                    />
                  </Th>
                  <Th>
                    <Select
                      size="sm"
                      color={"white"}
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
                      color={"white"}
                      onChange={(e) =>
                        handleFilterChange("item_real_ID", e.target.value)
                      }
                    />
                  </Th>
                  <Th>
                    <Input
                      size="sm"
                      color={"white"}
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
                    <Tr
                      key={order.token}
                      _hover={{ bg: "rgba(130, 70, 190, 0.2)" }}
                      _odd={{ bg: "rgba(130, 70, 190, 0.1)" }}
                      _even={{ bg: "rgba(227, 11, 78, 0.1)" }}
                    >
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
                          {order.order_code}
                        </Button>
                      </Td>
                      <Td>
                        {currentState ===
                        "zarezerwowane" ? null : currentState === "wydane" ? ( // </Button> //   Wydaj // > //   onClick={() => handleStatusChange(order, "wydane")} //   colorScheme="blue" //   size="sm" // <Button
                          <Button
                            size="sm"
                            colorScheme="blue"
                            aria-label="Zmień status"
                            isDisabled={selected === currentState}
                            onClick={() => {
                              setSelectedItem(order);
                              openModal(order, selected);
                            }}
                          >
                            Zmień
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
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <Box
          position="relative"
          borderRadius="lg"
          overflow="hidden"
          mx={4}
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: "lg",
            padding: "2px",
            background:
              "linear-gradient(90deg, rgba(130, 70, 190, 0.8), rgba(227, 11, 78, 0.8))",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
          }}
        >
          <ModalContent
            bg="linear-gradient(to bottom, rgb(20, 10, 30), #0d0d0d)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            borderRadius="lg"
          >
            <ModalHeader
              bgGradient="linear(to-r, rgb(130, 70, 190), rgb(227,11,78))"
              color="white"
              borderTopRadius="lg"
              py={4}
            >
              Potwierdzenie zmiany statusu
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody py={6}>
              {modalData && (
                <Box color="white">
                  <Text fontSize="lg" mb={4}>
                    Czy na pewno chcesz zmienić status słuchawki{" "}
                    <Box as="span" color="purple.200" fontWeight="bold">
                      #{modalData.item.item_real_ID}
                    </Box>
                    ?
                  </Text>

                  <Box
                    bg="rgba(255, 255, 255, 0.05)"
                    p={4}
                    borderRadius="md"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                  >
                    <Text>
                      Klient:{" "}
                      <Box as="span" color="pink.200">
                        {modalData.item.first_name} {modalData.item.last_name}
                      </Box>
                    </Text>

                    <Text mt={2}>
                      Zamówienie:{" "}
                      <Box as="span" color="purple.200">
                        #{modalData.item.order}
                      </Box>
                    </Text>

                    <Text mt={2} display="flex" alignItems="center">
                      Nowy status:{" "}
                      <Badge
                        ml={2}
                        colorScheme={getColor(modalData.targetState)}
                        variant="solid"
                        fontSize="md"
                        px={3}
                        py={1}
                      >
                        {modalData.targetState}
                      </Badge>
                    </Text>
                  </Box>
                </Box>
              )}
            </ModalBody>

            <ModalFooter display="flex" justifyContent="center" pt={0} pb={6}>
              <Button
                bg="rgba(255, 255, 255, 0.15)"
                color="white"
                backdropFilter="blur(4px)"
                border="1px solid rgba(255, 255, 255, 0.2)"
                _hover={{
                  bg: "rgba(255, 255, 255, 0.25)",
                  borderColor: "rgba(255, 255, 255, 0.4)",
                }}
                onClick={onClose}
                mr={4}
              >
                Anuluj
              </Button>

              <Button
                bgGradient="linear(to-r, rgb(130, 70, 190), rgb(227,11,78))"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, rgb(130, 70, 190), rgb(249,72,38))",
                  transform: "translateY(-2px)",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                onClick={async () => {
                  await handleStatusChange(
                    modalData.item,
                    modalData.targetState
                  );
                  onClose();
                }}
              >
                Potwierdź
              </Button>
            </ModalFooter>
          </ModalContent>
        </Box>
      </Modal>
      <Modal
        isOpen={isOrderModalOpen}
        onClose={onOrderModalClose}
        isCentered
        size="xl"
      >
        <ModalOverlay bg="blackAlpha.700" backdropFilter="blur(4px)" />
        <Box
          position="relative"
          borderRadius="lg"
          overflow="hidden"
          mx={4}
          _before={{
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: "lg",
            padding: "2px",
            background:
              "linear-gradient(90deg, rgba(130, 70, 190, 0.8), rgba(227, 11, 78, 0.8))",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            pointerEvents: "none",
          }}
        >
          <ModalContent
            bg="linear-gradient(to bottom, rgb(20, 10, 30), #0d0d0d)"
            border="1px solid rgba(255, 255, 255, 0.1)"
            borderRadius="lg"
            maxH="90vh"
            overflowY="auto"
          >
            <ModalHeader
              bgGradient="linear(to-r, rgb(130, 70, 190), rgb(227,11,78))"
              color="white"
              borderTopRadius="lg"
              py={4}
            >
              Szczegóły zamówienia
            </ModalHeader>
            <ModalCloseButton color="white" />
            <ModalBody py={6}>
              {selectedOrderInfo && (
                <Box color="white">
                  <Box
                    bg="rgba(255, 255, 255, 0.05)"
                    p={6}
                    borderRadius="lg"
                    border="1px solid rgba(255, 255, 255, 0.1)"
                    mb={6}
                  >
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <Box>
                        <Text fontSize="sm" color="whiteAlpha.600">
                          ID zamówienia:
                        </Text>
                        <Text color="purple.200" fontWeight="medium">
                          {selectedOrderInfo.id}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="whiteAlpha.600">
                          Kod zamówienia:
                        </Text>
                        <Text color="purple.200" fontWeight="medium">
                          {selectedOrderInfo.order_code}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="whiteAlpha.600">
                          Imię:
                        </Text>
                        <Text color="pink.200">
                          {selectedOrderInfo.account?.first_name}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="whiteAlpha.600">
                          Nazwisko:
                        </Text>
                        <Text color="pink.200">
                          {selectedOrderInfo.account?.last_name}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="whiteAlpha.600">
                          Email:
                        </Text>
                        <Text color="whiteAlpha.800">
                          {selectedOrderInfo.account?.email}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="whiteAlpha.600">
                          Telefon:
                        </Text>
                        <Text color="whiteAlpha.800">
                          {selectedOrderInfo.account?.phone_number}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="whiteAlpha.600">
                          Liczba przedmiotów:
                        </Text>
                        <Text color="purple.200" fontWeight="medium">
                          {selectedOrderInfo.items_count}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="whiteAlpha.600">
                          Status:
                        </Text>
                        <Badge
                          colorScheme={getColor(selectedOrderInfo.state)}
                          variant="solid"
                          fontSize="sm"
                          px={2}
                          py={1}
                        >
                          {selectedOrderInfo.state}
                        </Badge>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="whiteAlpha.600">
                          Data utworzenia:
                        </Text>
                        <Text color="whiteAlpha.800">
                          {new Date(
                            selectedOrderInfo.creation_date
                          ).toLocaleString()}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontSize="sm" color="whiteAlpha.600">
                          Data modyfikacji:
                        </Text>
                        <Text color="whiteAlpha.800">
                          {new Date(
                            selectedOrderInfo.modification_date
                          ).toLocaleString()}
                        </Text>
                      </Box>
                    </SimpleGrid>
                  </Box>
                </Box>
              )}
            </ModalBody>
            <ModalFooter display="flex" justifyContent="center" pt={0} pb={6}>
              <Button
                bgGradient="linear(to-r, rgb(130, 70, 190), rgb(227,11,78))"
                color="white"
                _hover={{
                  bgGradient: "linear(to-r, rgb(130, 70, 190), rgb(249,72,38))",
                  transform: "translateY(-2px)",
                }}
                _active={{
                  transform: "translateY(0)",
                }}
                onClick={onOrderModalClose}
                minW="150px"
              >
                Zamknij
              </Button>
            </ModalFooter>
          </ModalContent>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdminItems;
