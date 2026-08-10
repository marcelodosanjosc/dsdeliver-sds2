import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchCategories, fetchProducts } from '../api';
import Header from '../Header';
import { Category, Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../OrderCard';

export default function Catalog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const navigation = useNavigation<any>();
  const { addToCart, totalItems, totalAmount } = useCart();

  useEffect(() => {
    fetchCategories()
      .then((res) => setCategories(res.data))
      .catch((err) => console.error('Erro ao buscar categorias:', err));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchProducts(selectedCategory)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error('Erro ao buscar produtos:', err))
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <View style={styles.container}>
      <Header />

      {/* Barra de Navegação do Cliente */}
      <View style={styles.navBar}>
        <Text style={styles.navTitle}>Cardápio</Text>
        <TouchableOpacity
          style={styles.myOrdersButton}
          onPress={() => navigation.navigate('MyOrders')}
          activeOpacity={0.7}
        >
          <Text style={styles.myOrdersText}>📋 Meus Pedidos</Text>
        </TouchableOpacity>
      </View>

      {/* Categorias */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          <TouchableOpacity
            style={[
              styles.categoryPill,
              selectedCategory === undefined && styles.categoryPillActive,
            ]}
            onPress={() => setSelectedCategory(undefined)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === undefined && styles.categoryTextActive,
              ]}
            >
              Todos
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryPill,
                selectedCategory === cat.id && styles.categoryPillActive,
              ]}
              onPress={() => setSelectedCategory(cat.id)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Lista de Produtos */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#DA5C5C" />
          <Text style={styles.loadingText}>Carregando cardápio...</Text>
        </View>
      ) : products.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Nenhum produto encontrado nesta categoria.</Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.productImage} />
              ) : null}
              <View style={styles.productInfo}>
                <View style={styles.productHeader}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
                </View>
                <Text style={styles.productDescription} numberOfLines={3}>
                  {item.description}
                </Text>
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => addToCart(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.addButtonText}>+ Adicionar ao Carrinho</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Barra Flutuante do Carrinho */}
      {totalItems > 0 && (
        <View style={styles.cartFooter}>
          <View>
            <Text style={styles.cartItemsCount}>
              {totalItems} {totalItems === 1 ? 'item' : 'itens'} no carrinho
            </Text>
            <Text style={styles.cartTotal}>{formatPrice(totalAmount)}</Text>
          </View>
          <TouchableOpacity
            style={styles.viewCartButton}
            onPress={() => navigation.navigate('Cart')}
            activeOpacity={0.85}
          >
            <Text style={styles.viewCartButtonText}>Ver Carrinho 🛒</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#263238',
    fontFamily: 'OpenSans_700Bold',
  },
  myOrdersButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#FFD6D6',
  },
  myOrdersText: {
    fontSize: 13,
    color: '#DA5C5C',
    fontWeight: 'bold',
    fontFamily: 'OpenSans_700Bold',
  },
  categoriesContainer: {
    backgroundColor: '#FFF',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EAEAEA',
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  categoryPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  categoryPillActive: {
    backgroundColor: '#DA5C5C',
  },
  categoryText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
    fontFamily: 'OpenSans_700Bold',
  },
  categoryTextActive: {
    color: '#FFF',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#9E9E9E',
    fontFamily: 'OpenSans_400Regular',
  },
  emptyText: {
    color: '#9E9E9E',
    fontSize: 15,
    fontFamily: 'OpenSans_400Regular',
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
  productCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  productInfo: {
    padding: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  productName: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#263238',
    fontFamily: 'OpenSans_700Bold',
    marginRight: 8,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#DA5C5C',
    fontFamily: 'OpenSans_700Bold',
  },
  productDescription: {
    fontSize: 13,
    color: '#9E9E9E',
    lineHeight: 18,
    fontFamily: 'OpenSans_400Regular',
    marginBottom: 14,
  },
  addButton: {
    backgroundColor: '#FFF0F0',
    borderWidth: 1,
    borderColor: '#DA5C5C',
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#DA5C5C',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'OpenSans_700Bold',
  },
  cartFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#263238',
    paddingHorizontal: 20,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -3 },
    elevation: 8,
  },
  cartItemsCount: {
    color: '#B0BEC5',
    fontSize: 12,
    fontFamily: 'OpenSans_400Regular',
  },
  cartTotal: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'OpenSans_700Bold',
  },
  viewCartButton: {
    backgroundColor: '#DA5C5C',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  viewCartButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'OpenSans_700Bold',
  },
});
