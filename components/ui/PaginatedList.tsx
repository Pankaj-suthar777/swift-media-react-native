import { FlatList, FlatListProps, RefreshControl, View } from "react-native";
import PulseAnimationContainer from "./PulseAnimationContainer";
import Loader from "./Loader";

interface Props<T> {
  data: FlatListProps<T>["data"] | undefined;
  renderItem: FlatListProps<T>["renderItem"];
  ListEmptyComponent?: FlatListProps<T>["ListEmptyComponent"];
  isFetching?: boolean;
  refreshing?: boolean;
  hasMore?: boolean;
  onRefresh?(): void;
  onEndReached?: FlatListProps<T>["onEndReached"];
}

const PaginatedList = <T extends any>(props: Props<T>) => {
  const {
    data,
    renderItem,
    onEndReached,
    ListEmptyComponent,
    isFetching,
    onRefresh,
    refreshing = false,
    hasMore,
  } = props;

  return (
    <FlatList
      nestedScrollEnabled={true}
      style={{ paddingHorizontal: 12 }}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      onEndReached={(info) => {
        if (!hasMore || isFetching) return;
        onEndReached && onEndReached(info);
      }}
      ListFooterComponent={<Footer visible={isFetching} />}
      data={data}
      ListEmptyComponent={ListEmptyComponent}
      renderItem={renderItem}
      keyExtractor={(item: any) => item.id.toString()}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={"black"}
        />
      }
    />
  );
};

const Footer = (props: { visible?: boolean }) => {
  if (!props.visible) return null;

  return (
    <PulseAnimationContainer>
      <Loader size={24} />
    </PulseAnimationContainer>
  );
};

export default PaginatedList;
