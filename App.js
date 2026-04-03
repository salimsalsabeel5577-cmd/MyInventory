import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

function DashboardScreen({ products, purchases, sales, manufacturing }) {
  const totalProducts = products.length;
  const totalPurchase = purchases.reduce((sum, item) => sum + item.total, 0);
  const totalSales = sales.reduce((sum, item) => sum + item.total, 0);
  const stockValue = products.reduce(
    (sum, item) => sum + item.stockQty * item.costPrice,
    0
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Accounting Dashboard</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Products</Text>
        <Text style={styles.cardValue}>{totalProducts}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Purchase</Text>
        <Text style={styles.cardValue}>{totalPurchase.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Sales</Text>
        <Text style={styles.cardValue}>{totalSales.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Stock Value</Text>
        <Text style={styles.cardValue}>{stockValue.toFixed(2)}</Text>
      </View>

      <Text style={[styles.title, { marginTop: 10 }]}>Current Stock</Text>
      {products.map((item) => (
        <View key={item.id} style={styles.listCard}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text>Category: {item.category}</Text>
          <Text>Unit: {item.unit}</Text>
          <Text>Stock: {item.stockQty}</Text>
          <Text>Cost Price: {item.costPrice}</Text>
          <Text>Selling Price: {item.sellingPrice}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function InventoryScreen({ products, setProducts }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Raw Material");
  const [unit, setUnit] = useState("");
  const [costPrice, setCostPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");

  const addProduct = () => {
    if (!name || !unit || !costPrice || !sellingPrice) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    const exists = products.find(
      (p) => p.name.toLowerCase() === name.toLowerCase()
    );
    if (exists) {
      Alert.alert("Error", "Product already exists");
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name,
      category,
      unit,
      stockQty: 0,
      costPrice: parseFloat(costPrice),
      sellingPrice: parseFloat(sellingPrice),
    };

    setProducts((prev) => [newProduct, ...prev]);
    setName("");
    setCategory("Raw Material");
    setUnit("");
    setCostPrice("");
    setSellingPrice("");
    Alert.alert("Success", "Product added");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Add Product</Text>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Category (Raw Material / Finished Good)"
        value={category}
        onChangeText={setCategory}
      />

      <TextInput
        style={styles.input}
        placeholder="Unit (pcs, kg, meter, set)"
        value={unit}
        onChangeText={setUnit}
      />

      <TextInput
        style={styles.input}
        placeholder="Cost Price"
        keyboardType="numeric"
        value={costPrice}
        onChangeText={setCostPrice}
      />

      <TextInput
        style={styles.input}
        placeholder="Selling Price"
        keyboardType="numeric"
        value={sellingPrice}
        onChangeText={setSellingPrice}
      />

      <TouchableOpacity style={styles.button} onPress={addProduct}>
        <Text style={styles.buttonText}>Save Product</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Product List</Text>
      {products.map((item) => (
        <View key={item.id} style={styles.listCard}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text>{item.category}</Text>
          <Text>Stock: {item.stockQty}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function PurchaseScreen({ products, setProducts, purchases, setPurchases }) {
  const [productName, setProductName] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");

  const addPurchase = () => {
    const product = products.find(
      (p) => p.name.toLowerCase() === productName.toLowerCase()
    );

    if (!product) {
      Alert.alert("Error", "Product not found");
      return;
    }

    const purchaseQty = parseFloat(qty);
    const purchasePrice = parseFloat(price);

    if (!purchaseQty || !purchasePrice) {
      Alert.alert("Error", "Enter valid qty and price");
      return;
    }

    const total = purchaseQty * purchasePrice;

    const purchaseItem = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      qty: purchaseQty,
      price: purchasePrice,
      total,
      date: new Date().toLocaleString(),
    };

    setPurchases((prev) => [purchaseItem, ...prev]);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? {
              ...p,
              stockQty: p.stockQty + purchaseQty,
              costPrice: purchasePrice,
            }
          : p
      )
    );

    setProductName("");
    setQty("");
    setPrice("");
    Alert.alert("Success", "Purchase saved");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Purchase Entry</Text>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
      />

      <TextInput
        style={styles.input}
        placeholder="Qty"
        keyboardType="numeric"
        value={qty}
        onChangeText={setQty}
      />

      <TextInput
        style={styles.input}
        placeholder="Price"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      <TouchableOpacity style={styles.button} onPress={addPurchase}>
        <Text style={styles.buttonText}>Save Purchase</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Purchase History</Text>
      {purchases.map((item) => (
        <View key={item.id} style={styles.listCard}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text>Qty: {item.qty}</Text>
          <Text>Price: {item.price}</Text>
          <Text>Total: {item.total}</Text>
          <Text>{item.date}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function SalesScreen({ products, setProducts, sales, setSales }) {
  const [productName, setProductName] = useState("");
  const [qty, setQty] = useState("");

  const addSale = () => {
    const product = products.find(
      (p) => p.name.toLowerCase() === productName.toLowerCase()
    );

    if (!product) {
      Alert.alert("Error", "Product not found");
      return;
    }

    const saleQty = parseFloat(qty);

    if (!saleQty || saleQty <= 0) {
      Alert.alert("Error", "Enter valid qty");
      return;
    }

    if (product.stockQty < saleQty) {
      Alert.alert("Error", "Not enough stock");
      return;
    }

    const total = saleQty * product.sellingPrice;

    const saleItem = {
      id: Date.now().toString(),
      productId: product.id,
      productName: product.name,
      qty: saleQty,
      price: product.sellingPrice,
      total,
      date: new Date().toLocaleString(),
    };

    setSales((prev) => [saleItem, ...prev]);

    setProducts((prev) =>
      prev.map((p) =>
        p.id === product.id
          ? { ...p, stockQty: p.stockQty - saleQty }
          : p
      )
    );

    setProductName("");
    setQty("");
    Alert.alert("Success", "Sale saved");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sales Entry</Text>

      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
      />

      <TextInput
        style={styles.input}
        placeholder="Qty"
        keyboardType="numeric"
        value={qty}
        onChangeText={setQty}
      />

      <TouchableOpacity style={styles.button} onPress={addSale}>
        <Text style={styles.buttonText}>Save Sale</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Sales History</Text>
      {sales.map((item) => (
        <View key={item.id} style={styles.listCard}>
          <Text style={styles.productName}>{item.productName}</Text>
          <Text>Qty: {item.qty}</Text>
          <Text>Price: {item.price}</Text>
          <Text>Total: {item.total}</Text>
          <Text>{item.date}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

function ManufacturingScreen({
  products,
  setProducts,
  manufacturing,
  setManufacturing,
}) {
  const [rawProductName, setRawProductName] = useState("");
  const [finishedProductName, setFinishedProductName] = useState("");
  const [rawQtyUsed, setRawQtyUsed] = useState("");
  const [finishedQtyMade, setFinishedQtyMade] = useState("");

  const addManufacturing = () => {
    const raw = products.find(
      (p) => p.name.toLowerCase() === rawProductName.toLowerCase()
    );
    const finished = products.find(
      (p) => p.name.toLowerCase() === finishedProductName.toLowerCase()
    );

    if (!raw || !finished) {
      Alert.alert("Error", "Raw or finished product not found");
      return;
    }

    const rawQty = parseFloat(rawQtyUsed);
    const finishedQty = parseFloat(finishedQtyMade);

    if (!rawQty || !finishedQty) {
      Alert.alert("Error", "Enter valid quantities");
      return;
    }

    if (raw.stockQty < rawQty) {
      Alert.alert("Error", "Not enough raw material stock");
      return;
    }

    const record = {
      id: Date.now().toString(),
      rawProductId: raw.id,
      rawProductName: raw.name,
      finishedProductId: finished.id,
      finishedProductName: finished.name,
      rawQtyUsed: rawQty,
      finishedQtyMade: finishedQty,
      date: new Date().toLocaleString(),
    };

    setManufacturing((prev) => [record, ...prev]);

    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === raw.id) {
          return { ...p, stockQty: p.stockQty - rawQty };
        }
        if (p.id === finished.id) {
          return { ...p, stockQty: p.stockQty + finishedQty };
        }
        return p;
      })
    );

    setRawProductName("");
    setFinishedProductName("");
    setRawQtyUsed("");
    setFinishedQtyMade("");
    Alert.alert("Success", "Manufacturing saved");
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Manufacturing Entry</Text>

      <TextInput
        style={styles.input}
        placeholder="Raw Product Name"
        value={rawProductName}
        onChangeText={setRawProductName}
      />

      <TextInput
        style={styles.input}
        placeholder="Finished Product Name"
        value={finishedProductName}
        onChangeText={setFinishedProductName}
      />

      <TextInput
        style={styles.input}
        placeholder="Raw Qty Used"
        keyboardType="numeric"
        value={rawQtyUsed}
        onChangeText={setRawQtyUsed}
      />

      <TextInput
        style={styles.input}
        placeholder="Finished Qty Made"
        keyboardType="numeric"
        value={finishedQtyMade}
        onChangeText={setFinishedQtyMade}
      />

      <TouchableOpacity style={styles.button} onPress={addManufacturing}>
        <Text style={styles.buttonText}>Save Manufacturing</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Manufacturing History</Text>
      {manufacturing.map((item) => (
        <View key={item.id} style={styles.listCard}>
          <Text style={styles.productName}>
            {item.rawProductName} → {item.finishedProductName}
          </Text>
          <Text>Raw Used: {item.rawQtyUsed}</Text>
          <Text>Finished Made: {item.finishedQtyMade}</Text>
          <Text>{item.date}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export default function App() {
  const [products, setProducts] = useState([
    {
      id: "1",
      name: "Cotton Fabric",
      category: "Raw Material",
      unit: "meter",
      stockQty: 100,
      costPrice: 12,
      sellingPrice: 0,
    },
    {
      id: "2",
      name: "Bedsheet Single",
      category: "Finished Good",
      unit: "pcs",
      stockQty: 20,
      costPrice: 25,
      sellingPrice: 35,
    },
  ]);

  const [purchases, setPurchases] = useState([]);
  const [sales, setSales] = useState([]);
  const [manufacturing, setManufacturing] = useState([]);

  const sharedProps = useMemo(
    () => ({
      products,
      setProducts,
      purchases,
      setPurchases,
      sales,
      setSales,
      manufacturing,
      setManufacturing,
    }),
    [products, purchases, sales, manufacturing]
  );

  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1 }}>
        <Tab.Navigator screenOptions={{ headerShown: true }}>
          <Tab.Screen name="Dashboard">
            {() => (
              <DashboardScreen
                products={products}
                purchases={purchases}
                sales={sales}
                manufacturing={manufacturing}
              />
            )}
          </Tab.Screen>

          <Tab.Screen name="Inventory">
            {() => (
              <InventoryScreen
                products={products}
                setProducts={setProducts}
              />
            )}
          </Tab.Screen>

          <Tab.Screen name="Purchase">
            {() => (
              <PurchaseScreen
                products={products}
                setProducts={setProducts}
                purchases={purchases}
                setPurchases={setPurchases}
              />
            )}
          </Tab.Screen>

          <Tab.Screen name="Sales">
            {() => (
              <SalesScreen
                products={products}
                setProducts={setProducts}
                sales={sales}
                setSales={setSales}
              />
            )}
          </Tab.Screen>

          <Tab.Screen name="Manufacture">
            {() => (
              <ManufacturingScreen
                products={products}
                setProducts={setProducts}
                manufacturing={manufacturing}
                setManufacturing={setManufacturing}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f2f4f7",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 14,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    color: "#444",
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  button: {
    backgroundColor: "#111827",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  listCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
});
