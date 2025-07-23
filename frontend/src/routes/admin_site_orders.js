import React from "react";
import {
  Box,
  Heading,
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
  Badge,
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
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { useAuth } from "../context/auth";
import { useEffect, useState } from "react";
import { getAllOrders, change_order_state } from "../endpoints/api";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const { logoutUser, refresh } = useAuth();
  const [orders, setOrders] = useState([]);
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

  const nav = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
  };

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
    try {
      await change_order_state(newStatus, selectedOrder.id);
      selectedOrder.state = newStatus;
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id ? { ...order, state: newStatus } : order
        )
      );
      setSelectedOrder(null);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Błąd przy zmianie statusu");
    }
  };

  const updateHeadphoneCount = (orders) => {
    const count = orders
      .filter((order) => order.state === "zaakceptowane")
      .reduce((total, order) => total + order.items_count, 0);
    console.log(orders.filter((order) => order.state === "zaakceptowane"));
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
      setLoading(true);
      try {
        const orders = await getAllOrders();
        console.log(orders);
        setOrders(orders);
        setFilteredOrders(orders);
        // Initialize selectedStatuses with current order statuses
        const initialStatuses = orders.reduce(
          (acc, order) => ({
            ...acc,
            [order.id]: order.state,
          }),
          {}
        );
        setSelectedStatuses(initialStatuses);
        setLoading(false);
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            await refresh();
            const orders = await getAllOrders();
            setOrders(orders);
            setFilteredOrders(orders);
            // Initialize selectedStatuses with current order statuses
            const initialStatuses = orders.reduce(
              (acc, order) => ({
                ...acc,
                [order.id]: order.state,
              }),
              {}
            );
            setSelectedStatuses(initialStatuses);
            setLoading(false);
          } catch (refreshError) {
            alert("Twoja sesja wygasła. Zaloguj się ponownie.");
            nav("/login");
          }
        } else {
          setOrders([]);
          setFilteredOrders([]);
          setSelectedStatuses({});
          setLoading(false);
        }
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    updateHeadphoneCount(orders);
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

  return (
    <Box p={4}>
      <Box mt={4} mb={4}>
        <strong>Aktualnie wypożyczone słuchawki:</strong> {headphoneCount}
      </Box>
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
                  <Th>
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
                  <Th>
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
                  <Th>
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
                  <Th>
                    Ilość
                    <IconButton
                      aria-label="Sort ascending"
                      icon={<TriangleUpIcon />}
                      size="xs"
                      ml={2}
                      onClick={() => handleSort("items_count", "asc")}
                      isActive={
                        sortField === "items_count" && sortDirection === "asc"
                      }
                    />
                    <IconButton
                      aria-label="Sort descending"
                      icon={<TriangleDownIcon />}
                      size="xs"
                      ml={1}
                      onClick={() => handleSort("items_count", "desc")}
                      isActive={
                        sortField === "items_count" && sortDirection === "desc"
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
                  <Th>
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
                        handleFilterChange("account.first_name", e.target.value)
                      }
                    />
                  </Th>
                  <Th>
                    <Input
                      size="sm"
                      onChange={(e) =>
                        handleFilterChange("account.last_name", e.target.value)
                      }
                    />
                  </Th>
                  <Th>
                    <Input
                      size="sm"
                      onChange={(e) =>
                        handleFilterChange("account.email", e.target.value)
                      }
                    />
                  </Th>
                  <Th>
                    <Input
                      size="sm"
                      onChange={(e) =>
                        handleFilterChange(
                          "account.phone_number",
                          e.target.value
                        )
                      }
                    />
                  </Th>
                  <Th>
                    <Input
                      size="sm"
                      onChange={(e) =>
                        handleFilterChange("items_count", e.target.value)
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
                      <option value="oczekujące">oczekujące</option>
                      <option value="zaakceptowane">zaakceptowane</option>
                      <option value="anulowane">anulowane</option>
                    </Select>
                  </Th>
                  <Th colSpan={2} />
                </Tr>
              </Thead>
              <Tbody>
                {filteredOrders.map((order) => (
                  <Tr key={order.id}>
                    <Td>{order.id}</Td>
                    <Td>{order.account.first_name}</Td>
                    <Td>{order.account.last_name}</Td>
                    <Td>{order.account.email}</Td>
                    <Td>{order.account.phone_number}</Td>
                    <Td>{order.items_count}</Td>
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
            Czy na pewno chcesz zmienić status zamówienia dla{" "}
            <strong>
              {selectedOrder?.account?.first_name}{" "}
              {selectedOrder?.account?.last_name}
            </strong>{" "}
            (ID: {selectedOrder?.id}) na <strong>{newStatus}</strong>?
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
    </Box>
  );
};

export default Admin;
