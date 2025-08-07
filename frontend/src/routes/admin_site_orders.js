import React from "react";
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Button,
  Text,
  Spinner,
  Th,
  Td,
  TableContainer,
  Input,
  Select,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon, BellIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/auth";
import { useOrdersContext } from "../context/ordersContext";
import { useEffect, useState } from "react";
import { change_order_state, sendOrderReminder } from "../endpoints/api";

const Admin = ({showToast}) => {
  const { withErrorHandler, withRefresh } = useAuth();
  const { orders, setOrders, loadOrders } = useOrdersContext();
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [filters, setFilters] = useState({});
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [headphoneCount, setHeadphoneCount] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);

  const getColor = (state) => {
    switch (state) {
      case "oczekujące":
        return "yellow";
      case "zaakceptowane":
        return "green";
      case "anulowane":
        return "red";
      default:
        return "gray";
    }
  };

  const handleStatusChange = async (order, status) => {
    // await change_order_state(newStatus, order.id);
    setSelectedOrder(order);
    setNewStatus(status);
    setIsModalOpen(true);
  };

  const confirmStatusChange = async () => {
    await withRefresh(
      async () => {
        await change_order_state(newStatus, selectedOrder.id);
        selectedOrder.state = newStatus;
        setOrders((prev) =>
          prev.map((order) =>
            order.id === selectedOrder.id
              ? { ...order, state: newStatus }
              : order
          )
        );
        setSelectedOrder(null);
        setIsModalOpen(false);
        /*toast.success("Pomyślnie zmieniono status zamówienia");*/
        showToast("success", "Pomyślnie zmieniono status zamówienia");
      },
      () => {
        console.error("Błąd przy zmianie statusu");
      }
    );
  };
  const isOlderThan = (dateStr, hours) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInMs = now - date;
    return diffInMs > hours * 60 * 60 * 1000;
  };

  const isOlderThan8Hours = (dateStr) => {
    return isOlderThan(dateStr, 8);
  };
  const isOlderThan12Hours = (dateStr) => {
    return isOlderThan(dateStr, 12);
  };

  const getRowStyle = (state, dateStr, index) => {
    const baseColor =
      index % 2 === 0 ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)";

    if (state !== "oczekujące") return baseColor;

    if (isOlderThan12Hours(dateStr)) return "rgba(255, 0, 0, 0.4)";
    if (isOlderThan8Hours(dateStr)) return "rgba(0, 255, 0, 0.4)";

    return baseColor;
  };

  const getHoverBgColor = (state, dateStr) => {
    if (state !== "oczekujące") return "rgba(255, 255, 255, 0.6)";

    if (isOlderThan12Hours(dateStr)) return "rgba(255, 0, 0, 0.6)";
    if (isOlderThan8Hours(dateStr)) return "rgba(0, 255, 0, 0.6)";

    return "gray.300";
  };
  const handleSendReminder = async (order) => {
    setSelectedOrder(order);
    setIsReminderModalOpen(true);
  };
  const sendReminder = async () => {
    await withRefresh(
      async () => {
        console.log(selectedOrder.id);
        await sendOrderReminder(selectedOrder.id);
        setSelectedOrder(null);
        setIsReminderModalOpen(false);
        // toast.success("Pomyślnie wysłano maila");
        // setShowCustomToast(true);
        showToast("success", "Pomyślnie wysłano maila");
      },
      () => {
        console.error("Błąd podczas wysyłania maila");
      }
    );
  };

  const updateHeadphoneCount = (orders) => {
    const count = orders
      .filter((order) => order.state === "zaakceptowane")
      .reduce((total, order) => total + order.items_count, 0);
    setHeadphoneCount(count);
  };
  const handleSelectChange = (orderId, value) => {
    setSelectedStatuses((prev) => ({
      ...prev,
      [orderId]: value,
    }));
  };

  useEffect(() => {
    const fetchOrders = async () => {
      console.log("orders");
      setLoading(true);
      await loadOrders();
      setLoading(false);
    };

    withErrorHandler(fetchOrders, () => {
      setOrders([]);
      setFilteredOrders([]);
      setSelectedStatuses({});
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    updateHeadphoneCount(orders);
    const initialStatuses = orders.reduce(
      (acc, order) => ({
        ...acc,
        [order.id]: order.state,
      }),
      {}
    );
    setFilteredOrders(orders);
    setSelectedStatuses(initialStatuses);
  }, [orders]);

  const handleFilterChange = (field, value) => {
    const newFilters = { ...filters, [field]: value.toLowerCase() };
    setFilters(newFilters);

    const filtered = orders.filter((order) => {
      return Object.entries(newFilters).every(([key, val]) => {
        const target = key.includes("account.")
          ? order.account[key.split(".")[1]]
          : order[key];

        return String(target).toLowerCase().includes(val);
      });
    });

    setFilteredOrders(filtered);
  };

  const handleSort = (field, direction) => {
    const sorted = [...filteredOrders].sort((a, b) => {
      const aVal = field.includes("account.")
        ? a.account[field.split(".")[1]]
        : a[field];
      const bVal = field.includes("account.")
        ? b.account[field.split(".")[1]]
        : b[field];
      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setSortField(field);
    setSortDirection(direction);
    setFilteredOrders(sorted);
  };
  function formatPhoneNumber(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3");
  }
  return (
    <>
      <Box p={2}>
        <Box mt={4} mb={4}>
          <strong>Aktualnie zarezerwowane słuchawki:</strong> {headphoneCount}
        </Box>
        <Box mt={8}>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              minH="200px"
            >
              <Spinner
                size="xl"
                thickness="4px"
                speed="0.65s"
                color="blue.500"
              />
            </Box>
          ) : (
            <TableContainer>
              <Table
                variant="simple"
                colorScheme="blue"
                size="sm"
                fontSize="sm"
              >
                <Thead>
                  <Tr>
                    <Th fontSize="xs" color={"white"}>
                      Zamówienie
                      <IconButton
                        aria-label="Sort ascending"
                        icon={<TriangleUpIcon />}
                        size="xs"
                        ml={2}
                        onClick={() => handleSort("order_code", "asc")}
                        isActive={
                          sortField === "order_code" && sortDirection === "asc"
                        }
                      />
                      <IconButton
                        aria-label="Sort descending"
                        icon={<TriangleDownIcon />}
                        size="xs"
                        ml={1}
                        onClick={() => handleSort("order_code", "desc")}
                        isActive={
                          sortField === "order_code" && sortDirection === "desc"
                        }
                      />
                    </Th>
                    <Th fontSize="xs" color={"white"}>
                      Imię
                      <IconButton
                        aria-label="Sort ascending"
                        icon={<TriangleUpIcon />}
                        size="xs"
                        ml={2}
                        onClick={() => handleSort("account.first_name", "asc")}
                        isActive={
                          sortField === "account.first_name" &&
                          sortDirection === "asc"
                        }
                      />
                      <IconButton
                        aria-label="Sort descending"
                        icon={<TriangleDownIcon />}
                        size="xs"
                        ml={1}
                        onClick={() => handleSort("account.first_name", "desc")}
                        isActive={
                          sortField === "account.first_name" &&
                          sortDirection === "desc"
                        }
                      />
                    </Th>
                    <Th fontSize="xs" color={"white"}>
                      Nazwisko
                      <IconButton
                        aria-label="Sort ascending"
                        icon={<TriangleUpIcon />}
                        size="xs"
                        ml={2}
                        onClick={() => handleSort("account.last_name", "asc")}
                        isActive={
                          sortField === "account.last_name" &&
                          sortDirection === "asc"
                        }
                      />
                      <IconButton
                        aria-label="Sort descending"
                        icon={<TriangleDownIcon />}
                        size="xs"
                        ml={1}
                        onClick={() => handleSort("account.last_name", "desc")}
                        isActive={
                          sortField === "account.last_name" &&
                          sortDirection === "desc"
                        }
                      />
                    </Th>
                    <Th fontSize="xs" color={"white"}>
                      Email
                      <IconButton
                        aria-label="Sort ascending"
                        icon={<TriangleUpIcon />}
                        size="xs"
                        ml={2}
                        onClick={() => handleSort("account.email", "asc")}
                        isActive={
                          sortField === "account.email" &&
                          sortDirection === "asc"
                        }
                      />
                      <IconButton
                        aria-label="Sort descending"
                        icon={<TriangleDownIcon />}
                        size="xs"
                        ml={1}
                        onClick={() => handleSort("account.email", "desc")}
                        isActive={
                          sortField === "account.email" &&
                          sortDirection === "desc"
                        }
                      />
                    </Th>
                    <Th fontSize="xs" color={"white"}>
                      Telefon
                      <IconButton
                        aria-label="Sort ascending"
                        icon={<TriangleUpIcon />}
                        size="xs"
                        ml={2}
                        onClick={() =>
                          handleSort("account.phone_number", "asc")
                        }
                        isActive={
                          sortField === "account.phone_number" &&
                          sortDirection === "asc"
                        }
                      />
                      <IconButton
                        aria-label="Sort descending"
                        icon={<TriangleDownIcon />}
                        size="xs"
                        ml={1}
                        onClick={() =>
                          handleSort("account.phone_number", "desc")
                        }
                        isActive={
                          sortField === "account.phone_number" &&
                          sortDirection === "desc"
                        }
                      />
                    </Th>
                    <Th fontSize="xs" color={"white"}>
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
                    <Th fontSize="xs" color={"white"}>
                      Utworzono
                      <IconButton
                        aria-label="Sort ascending"
                        icon={<TriangleUpIcon />}
                        size="xs"
                        ml={2}
                        onClick={() => handleSort("creation_date", "asc")}
                        isActive={
                          sortField === "creation_date" &&
                          sortDirection === "asc"
                        }
                      />
                      <IconButton
                        aria-label="Sort descending"
                        icon={<TriangleDownIcon />}
                        size="xs"
                        ml={1}
                        onClick={() => handleSort("creation_date", "desc")}
                        isActive={
                          sortField === "creation_date" &&
                          sortDirection === "desc"
                        }
                      />
                    </Th>
                    {/* <Th fontSize="xs">
                    Zmiana
                    <IconButton
                      aria-label="Sort ascending"
                      icon={<TriangleUpIcon />}
                      size="xs"
                      ml={2}
                      onClick={() => handleSort("modification_date", "asc")}
                      isActive={
                        sortField === "modification_date" &&
                        sortDirection === "asc"
                      }
                    />
                    <IconButton
                      aria-label="Sort descending"
                      icon={<TriangleDownIcon />}
                      size="xs"
                      ml={1}
                      onClick={() => handleSort("modification_date", "desc")}
                      isActive={
                        sortField === "modification_date" &&
                        sortDirection === "desc"
                      }
                    />
                  </Th> */}
                    <Th
                      fontSize="xs"
                      colSpan={2}
                      textAlign="center"
                      color={"white"}
                    >
                      Akcje
                    </Th>
                  </Tr>
                  <Tr>
                    <Th fontSize="sm">
                      <Input
                        size="xs"
                        color={"white"}
                        onChange={(e) =>
                          handleFilterChange("order_code", e.target.value)
                        }
                      />
                    </Th>
                    <Th fontSize="sm">
                      <Input
                        size="xs"
                        color={"white"}
                        onChange={(e) =>
                          handleFilterChange(
                            "account.first_name",
                            e.target.value
                          )
                        }
                      />
                    </Th>
                    <Th fontSize="sm">
                      <Input
                        size="xs"
                        color={"white"}
                        onChange={(e) =>
                          handleFilterChange(
                            "account.last_name",
                            e.target.value
                          )
                        }
                      />
                    </Th>
                    <Th fontSize="sm">
                      <Input
                        size="xs"
                        color={"white"}
                        onChange={(e) =>
                          handleFilterChange("account.email", e.target.value)
                        }
                      />
                    </Th>
                    <Th fontSize="sm">
                      <Input
                        size="xs"
                        color={"white"}
                        onChange={(e) =>
                          handleFilterChange(
                            "account.phone_number",
                            e.target.value
                          )
                        }
                      />
                    </Th>
                    <Th fontSize="sm">
                      <Select
                        size="xs"
                        placeholder="Wszystkie"
                        color={"white"}
                        // variant="filled"
                        onChange={(e) =>
                          handleFilterChange("state", e.target.value)
                        }
                      >
                        <option value="oczekujące">Oczekujące</option>
                        <option value="zaakceptowane">Zaakceptowane</option>
                        <option value="anulowane">Anulowane</option>
                      </Select>
                    </Th>
                    <Th fontSize="sm" colSpan={4} />
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredOrders.map((order, index) => (
                    <Tr
                      key={order.order_code}
                      bg={getRowStyle(order.state, order.creation_date, index)}
                      _hover={{
                        bg: getHoverBgColor(order.state, order.creation_date),
                      }}
                    >
                      <Td>{order.order_code}</Td>
                      <Td>{order.account.first_name}</Td>
                      <Td>{order.account.last_name}</Td>
                      <Td>{order.account.email}</Td>
                      <Td>{formatPhoneNumber(order.account.phone_number)}</Td>
                      <Td>
                        {order.state === "oczekujące" ? (
                          <Select
                            size="sm"
                            value={selectedStatuses[order.id] || order.state}
                            onChange={(e) =>
                              handleSelectChange(order.id, e.target.value)
                            }
                            borderColor={getColor(
                              selectedStatuses[order.id] || order.state
                            )}
                          >
                            <option value="oczekujące">Oczekujące</option>
                            <option value="zaakceptowane">Zaakceptowane</option>
                            <option value="anulowane">Anulowane</option>
                          </Select>
                        ) : (
                          <Text
                            fontSize="sm"
                            fontWeight="medium"
                            color={getColor(order.state)}
                            textTransform="capitalize"
                          >
                            {order.state}
                          </Text>
                        )}
                      </Td>
                      <Td>{new Date(order.creation_date).toLocaleString()}</Td>
                      {/* <Td>
                      {new Date(order.modification_date).toLocaleString()}
                    </Td> */}
                      <Td>
                        {order.state === "oczekujące" && (
                          <Button
                            size="sm"
                            colorScheme="blue"
                            isDisabled={
                              (selectedStatuses[order.id] || order.state) ===
                              order.state
                            }
                            onClick={() =>
                              handleStatusChange(
                                order,
                                selectedStatuses[order.id] || order.state
                              )
                            }
                          >
                            Zmień
                          </Button>
                        )}
                      </Td>
                      <Td>
                        <IconButton
                          size="sm"
                          icon={<BellIcon />}
                          aria-label="Wyślij przypomnienie"
                          colorScheme="orange"
                          onClick={() => handleSendReminder(order)}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          )}
        </Box>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          isCentered
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
            >
              <ModalHeader
                bgGradient="linear(to-r, rgb(130, 70, 190), rgb(227,11,78))"
                color="white"
                borderTopRadius="lg"
                py={4}
              >
                Potwierdź zmianę statusu
              </ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody py={6}>
                <Text color="white" mb={4} textAlign="center" fontSize="lg">
                  Czy na pewno chcesz zmienić status zamówienia{" "}
                  <Box as="span" whiteSpace="nowrap" color="purple.200">
                    {selectedOrder?.order_code}
                  </Box>{" "}
                  dla{" "}
                  <Box as="span" color="pink.200">
                    {selectedOrder?.account?.first_name}{" "}
                    {selectedOrder?.account?.last_name}
                  </Box>{" "}
                  na{" "}
                  <Box as="span" color="pink.300">
                    {newStatus}
                  </Box>
                  ?
                </Text>
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
                  onClick={() => setIsModalOpen(false)}
                  mr={4}
                >
                  Anuluj
                </Button>

                <Button
                  bgGradient="linear(to-r, rgb(130, 70, 190), rgb(227,11,78))"
                  color="white"
                  _hover={{
                    bgGradient:
                      "linear(to-r, rgb(130, 70, 190), rgb(249,72,38))",
                    transform: "translateY(-2px)",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  onClick={confirmStatusChange}
                >
                  Potwierdź
                </Button>
              </ModalFooter>
            </ModalContent>
          </Box>
        </Modal>
        <Modal
          isOpen={isReminderModalOpen}
          onClose={() => setIsReminderModalOpen(false)}
          isCentered
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
            >
              <ModalHeader
                bgGradient="linear(to-r, rgb(130, 70, 190), rgb(227,11,78))"
                color="white"
                borderTopRadius="lg"
                py={4}
              >
                Potwierdź wysłanie powiadomienia
              </ModalHeader>
              <ModalCloseButton color="white" />
              <ModalBody py={6}>
                <Text color="white" mb={4} textAlign="center" fontSize="lg">
                  Czy na pewno chcesz wysłać ponownie powiadomienie mailowe do{" "}
                  <Box as="span" color="pink.200">
                    {selectedOrder?.account?.first_name}{" "}
                    {selectedOrder?.account?.last_name}
                  </Box>
                  {", "}numer zamówienia:{" "}
                  <Box as="span" whiteSpace="nowrap" color="purple.200">
                    {selectedOrder?.order_code}?
                  </Box>
                </Text>
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
                  onClick={() => setIsReminderModalOpen(false)}
                  mr={4}
                >
                  Anuluj
                </Button>

                <Button
                  bgGradient="linear(to-r, rgb(130, 70, 190), rgb(227,11,78))"
                  color="white"
                  _hover={{
                    bgGradient:
                      "linear(to-r, rgb(130, 70, 190), rgb(249,72,38))",
                    transform: "translateY(-2px)",
                  }}
                  _active={{
                    transform: "translateY(0)",
                  }}
                  onClick={sendReminder}
                >
                  Potwierdź
                </Button>
              </ModalFooter>
            </ModalContent>
          </Box>
        </Modal>
      </Box>
    </>
  );
};

export default Admin;
