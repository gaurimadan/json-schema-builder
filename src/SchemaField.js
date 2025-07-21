import React from 'react';
import { Input, Select, Button, Space, Card } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

function SchemaField({ field, onUpdate, onRemove }) { 

 
  const handleNameChange = (e) => {
    
    onUpdate(field.id, { name: e.target.value });
  };

  const handleTypeChange = (value) => {
   
    onUpdate(field.id, { type: value });
  };

 
  const handleAddNestedField = () => {
    
    onUpdate(field.id, {
      children: [...(field.children || []), { id: Date.now(), name: '', type: 'String', children: [] }]
    });
  };

 
  const handleRemoveNestedField = (nestedFieldId) => {
   
    onUpdate(field.id, {
      children: onRemove(nestedFieldId, field.children) 
    });
  };

  return (
    <Card size="small" style={{ marginBottom: '15px', border: '1px solid #d9d9d9' }}>
      <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
        <Input
          placeholder="Field Name"
          value={field.name}
          onChange={handleNameChange}
          style={{ flex: 1 }}
        />
        <Select
          value={field.type}
          onChange={handleTypeChange}
          style={{ width: '120px' }}
        >
          <Option value="String">String</Option>
          <Option value="Number">Number</Option>
          <Option value="Nested">Nested</Option>
          <Option value="Boolean">Boolean</Option>
          <Option value="Date">Date</Option>
          <Option value="Array">Array</Option>
          <Option value="Object">Object</Option>
          <Option value="float">float</Option>
        </Select>
        <Button
          type="text" 
          danger 
          icon={<MinusCircleOutlined />}
          onClick={() => onRemove(field.id)} 
          style={{ marginLeft: '8px' }}
        />
      </Space>

      {field.type === 'Nested' && (
        <div style={{
          marginLeft: '20px',
          borderLeft: '2px solid #e8e8e8',
          paddingLeft: '15px',
          marginTop: '10px',
        }}>
          {(field.children || []).map((nestedField) => (
            <SchemaField
              key={nestedField.id}
              field={nestedField}
              
              onUpdate={onUpdate}
              onRemove={onRemove}
            />
          ))}
          <Button
            type="dashed"
            onClick={handleAddNestedField}
            icon={<PlusOutlined />}
            style={{ width: '100%', marginTop: '10px' }}
          >
            Add Nested Field
          </Button>
        </div>
      )}
    </Card>
  );
}

export default SchemaField;