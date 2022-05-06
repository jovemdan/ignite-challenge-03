import { createContext, ReactNode, useContext, useState } from 'react'
import { toast } from 'react-toastify'
import { api } from '../services/api'
import { Product, Stock } from '../types'

interface CartProviderProps {
  children: ReactNode
}

interface UpdateProductAmount {
  productId: number
  amount: number
}

interface CartContextData {
  cart: Product[]
  addProduct: (productId: number) => Promise<void>
  removeProduct: (productId: number) => void
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void
}

const CartContext = createContext<CartContextData>({} as CartContextData)

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@RocketShoes:cart')

    if (storagedCart) {
      return setCart(JSON.parse(storagedCart))
    }

    return []
  })

  const addProduct = async (productId: number) => {
    try {
      const updatedCart = [...cart]
      const productExist = updatedCart.find(s => s.id === productId)
      const stock = await api.get(`/stock/${productId}`)
      const stockAmount = stock.data.amount
      const currentAmount = productExist ? productExist.amount : 0

      const amount = currentAmount + 1

      if (amount > stockAmount) {
        toast.error('Quantidade solicitada fora de estoque')
      }

      if (productExist) {
        productExist.amount = amount
      } else {
        const product = await api.get(`/products/${productId}`)
        setCart({
          ...product.data,
          amount: 1
        })

      }
    } catch {
      toast.error('Erro na adição do produto')
    }
  }

  const removeProduct = (productId: number) => {
    try {
      // TODO
    } catch {
      toast.error('Erro na remoção do produto')
    }
  }

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      // TODO
    } catch {
      toast.error('Erro na alteração de quantidade do produto')
    }
  }

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextData {
  const context = useContext(CartContext)

  return context
}
