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
import { toast } from "sonner";

const Admin = () => {
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
        toast.success("Pomyślnie zmieniono status zamówienia");
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
    const baseColor = index % 2 === 0 ? "gray.200" : "white";

    if (state !== "oczekujące") return baseColor;

    if (isOlderThan12Hours(dateStr)) return "red.100";
    if (isOlderThan8Hours(dateStr)) return "yellow.100";

    return baseColor;
  };

  const getHoverBgColor = (state, dateStr) => {
    if (state !== "oczekujące") return "gray.300";

    if (isOlderThan12Hours(dateStr)) return "red.200";
    if (isOlderThan8Hours(dateStr)) return "yellow.200";

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
        toast.success("Pomyślnie wysłano maila");
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
    <Box p={4}>
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
            <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
          </Box>
        ) : (
          <TableContainer>
            <Table variant="simple" colorScheme="blue" size="sm" fontSize="sm">
              <Thead>
                <Tr>
                  <Th fontSize="xs">
                    Numer zamówienia
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
                  <Th fontSize="xs">
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
                  <Th fontSize="xs">
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
                  <Th fontSize="xs">
                    Email
                    <IconButton
                      aria-label="Sort ascending"
                      icon={<TriangleUpIcon />}
                      size="xs"
                      ml={2}
                      onClick={() => handleSort("account.email", "asc")}
                      isActive={
                        sortField === "account.email" && sortDirection === "asc"
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
                  <Th fontSize="xs">
                    Telefon
                    <IconButton
                      aria-label="Sort ascending"
                      icon={<TriangleUpIcon />}
                      size="xs"
                      ml={2}
                      onClick={() => handleSort("account.phone_number", "asc")}
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
                      onClick={() => handleSort("account.phone_number", "desc")}
                      isActive={
                        sortField === "account.phone_number" &&
                        sortDirection === "desc"
                      }
                    />
                  </Th>
                  <Th fontSize="xs">
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
                  <Th fontSize="xs">
                    Utworzono
                    <IconButton
                      aria-label="Sort ascending"
                      icon={<TriangleUpIcon />}
                      size="xs"
                      ml={2}
                      onClick={() => handleSort("creation_date", "asc")}
                      isActive={
                        sortField === "creation_date" && sortDirection === "asc"
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
                  <Th fontSize="xs">
                    Ostatnia zmiana
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
                  </Th>
                  <Th fontSize="xs" colSpan={2} textAlign="center">
                    Akcje
                  </Th>
                </Tr>
                <Tr>
                  <Th fontSize="sm">
                    <Input
                      size="xs"
                      onChange={(e) =>
                        handleFilterChange("order_code", e.target.value)
                      }
                    />
                  </Th>
                  <Th fontSize="sm">
                    <Input
                      size="xs"
                      onChange={(e) =>
                        handleFilterChange("account.first_name", e.target.value)
                      }
                    />
                  </Th>
                  <Th fontSize="sm">
                    <Input
                      size="xs"
                      onChange={(e) =>
                        handleFilterChange("account.last_name", e.target.value)
                      }
                    />
                  </Th>
                  <Th fontSize="sm">
                    <Input
                      size="xs"
                      onChange={(e) =>
                        handleFilterChange("account.email", e.target.value)
                      }
                    />
                  </Th>
                  <Th fontSize="sm">
                    <Input
                      size="xs"
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
                      variant="filled"
                      onChange={(e) =>
                        handleFilterChange("state", e.target.value)
                      }
                    >
                      <option value="oczekujące">oczekujące</option>
                      <option value="zaakceptowane">zaakceptowane</option>
                      <option value="anulowane">anulowane</option>
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
                          <option value="oczekujące">oczekujące</option>
                          <option value="zaakceptowane">zaakceptowane</option>
                          <option value="anulowane">anulowane</option>
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
                    <Td>
                      {new Date(order.modification_date).toLocaleString()}
                    </Td>
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
                          Zmień status
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Potwierdź zmianę statusu</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Czy na pewno chcesz zmienić status zamówienia{" "}
            <Box as="span" whiteSpace="nowrap">
              {selectedOrder?.order_code}
            </Box>{" "}
            dla{" "}
            <strong>
              {selectedOrder?.account?.first_name}{" "}
              {selectedOrder?.account?.last_name}
            </strong>{" "}
            na <strong>{newStatus}</strong>?
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={confirmStatusChange}>
              Potwierdź
            </Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Anuluj
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Potwierdź wysłanie powiadomienia</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Czy na pewno chcesz wysłać ponownie powiadomienie mailowe do{" "}
            <strong>
              {selectedOrder?.account?.first_name}{" "}
              {selectedOrder?.account?.last_name}
            </strong>
            {", "}numer zamówienia:{" "}
            <Box as="span" whiteSpace="nowrap">
              {selectedOrder?.order_code}?
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={sendReminder}>
              Potwierdź
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsReminderModalOpen(false)}
            >
              Anuluj
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Admin;
